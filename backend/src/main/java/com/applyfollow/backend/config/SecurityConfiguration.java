package com.applyfollow.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.applyfollow.backend.security.oauth2.CustomOAuth2UserService;
import com.applyfollow.backend.security.oauth2.OAuth2AuthenticationSuccessHandler;

import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Method-level security (@PreAuthorize) desteği
@RequiredArgsConstructor
public class SecurityConfiguration {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

        @Value("#{'${cors.allowed.origins}'.split(',')}")
        private List<String> allowedOrigins;

        private static final String[] WHITE_LIST_URL = {
                        "/api/auth/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/api/contact/**",
                        "/login/oauth2/code/**" // Allow OAuth2 callback endpoints
        };

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable) // JWT kullandığımız için CSRF kapatıyoruz
                                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS
                                                                                                   // konfigürasyonu
                                .authorizeHttpRequests(req -> req
                                                .requestMatchers(WHITE_LIST_URL).permitAll() // Public endpointler
                                                .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Admin yetkisi
                                                                                                        // şart
                                                .anyRequest().authenticated() // Diğer her şey için authentication şart
                                )
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // REST API
                                                                                                        // stateless
                                                                                                        // olmalı
                                )
                                .oauth2Login(oauth2 -> oauth2
                                                .authorizationEndpoint(authorization -> authorization
                                                                .baseUri("/api/oauth2/authorization"))
                                                .redirectionEndpoint(redirection -> redirection
                                                                .baseUri("/api/login/oauth2/code/*"))
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler((request, response, exception) -> {
                                                        System.out.println("OAuth2 Login Failed: "
                                                                        + exception.getMessage());
                                                        exception.printStackTrace();
                                                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                                                        "OAuth2 Login Failed: "
                                                                                        + exception.getMessage());
                                                }))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                // Yetkisiz erişimlerde 403 yerine 401 dönmesi için (Frontend redirect için
                                // önemli)
                                .exceptionHandling(e -> e.authenticationEntryPoint(
                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Allow origins defined in application.properties
                configuration.setAllowedOriginPatterns(allowedOrigins);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-User-Id"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}

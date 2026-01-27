package com.applyfollow.backend.config;

import lombok.extern.slf4j.Slf4j;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.applyfollow.backend.security.oauth2.CustomOAuth2UserService;
import com.applyfollow.backend.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.applyfollow.backend.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.applyfollow.backend.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;

import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Method-level security (@PreAuthorize) desteği
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
        private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

        @Value("#{'${cors.allowed.origins}'.split(',')}")
        private List<String> allowedOrigins;

        private static final String[] WHITE_LIST_URL = {
                        "/api/auth/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/api/contact/**",
                        "/api/login/oauth2/code/google",
                        "/error" // Claude'un önerisi: Hata durumunda yönlendirme izni
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
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Artık cookie
                                                                                                        // üzerinden
                                                                                                        // ilerlediğimiz
                                                                                                        // için
                                                                                                        // stateless'a
                                                                                                        // geri
                                                                                                        // dönebiliriz
                                )
                                .oauth2Login(oauth2 -> oauth2
                                                .authorizationEndpoint(authorization -> authorization
                                                                .baseUri("/api/oauth2/authorization")
                                                                .authorizationRequestRepository(
                                                                                httpCookieOAuth2AuthorizationRequestRepository))
                                                .redirectionEndpoint(redirection -> redirection
                                                                .baseUri("/api/login/oauth2/code/google")) // Dokümandaki
                                                                                                           // net
                                                                                                           // eşleşme
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(oAuth2AuthenticationFailureHandler))
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

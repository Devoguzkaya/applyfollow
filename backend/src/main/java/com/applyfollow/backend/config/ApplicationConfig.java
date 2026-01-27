package com.applyfollow.backend.config;

import com.applyfollow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository repository;
    private final java.util.Map<String, org.springframework.security.core.userdetails.UserDetails> userDetailsCache = new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Kullanıcı detaylarını veritabanından çeken servis.
     * Performans için basit bir cache mekanizması eklenmiştir.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userDetailsCache.computeIfAbsent(username, email -> repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email)));
    }

    /**
     * Authentication logic'ini yöneten Provider.
     * UserDetailsService ve PasswordEncoder'ı birleştirir.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Login işlemleri için gerekli olan Manager bean'i.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Şifreleri güvenli bir şekilde hashlemek için BCrypt algoritması kullanılır.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

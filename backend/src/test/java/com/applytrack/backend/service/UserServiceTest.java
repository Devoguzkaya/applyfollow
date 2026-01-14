package com.applytrack.backend.service;

import com.applytrack.backend.config.JwtService;
import com.applytrack.backend.dto.AuthResponse;
import com.applytrack.backend.dto.LoginRequest;
import com.applytrack.backend.dto.RegisterRequest;
import com.applytrack.backend.exception.BadRequestException;
import com.applytrack.backend.model.User;
import com.applytrack.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserService userService;

    @Test
    void register_WhenEmailExists_ShouldThrowException() {
        RegisterRequest request = new RegisterRequest("Test", "test@test.com", "pass");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(new User()));

        assertThrows(BadRequestException.class, () -> userService.register(request));
    }

    @Test
    void register_WhenSuccess_ShouldReturnToken() {
        RegisterRequest request = new RegisterRequest("Test", "new@test.com", "pass");
        User savedUser = User.builder().id(UUID.randomUUID()).email(request.email()).fullName(request.fullName())
                .build();

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");
        // capture save is redundant if we verify method call frequency, assume save
        // works void

        AuthResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_ShouldAuthenticateAndReturnToken() {
        LoginRequest request = new LoginRequest("test@test.com", "pass");
        User user = User.builder().id(UUID.randomUUID()).email(request.email()).build();

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        verify(authenticationManager).authenticate(any());
    }
}

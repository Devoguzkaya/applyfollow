package com.applyfollow.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.SerializationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;

import java.util.Base64;
import java.util.Optional;

@Slf4j
public class CookieUtils {

    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            log.info("Step: GetCookie - Incoming cookies count: {}", cookies.length);
            for (Cookie cookie : cookies) {
                log.info("Step: GetCookie - Browser sent cookie: '{}'", cookie.getName());
                if (cookie.getName().equals(name)) {
                    log.info("Step: GetCookie - MATCH FOUND for: {}", name);
                    return Optional.of(cookie);
                }
            }
        }
        log.warn("Step: GetCookie - Target cookie '{}' is NOT in the request headers!", name);
        return Optional.empty();
    }

    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        log.info("Step: AddCookie - Preparing '{}' (Value length: {} bytes)", name, value.length());

        // Localhost üzerinde portlar arası geçişte en güvenli yöntem Lax'tır.
        // Ama Secure=false olmalı çünkü HTTPS kullanmıyoruz.
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .httpOnly(true)
                .maxAge(maxAge)
                .sameSite("Lax")
                .secure(false) // HTTP üzerinden çalıştığımız için kesinlikle false olmalı
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.info("Step: AddCookie - 'Set-Cookie' header added to response successfully.");
    }

    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.info("Step: DeleteCookie - Expire header sent for: {}", name);
    }

    public static String serialize(Object object) {
        // En temiz ve karakter sorunu yaratmayan URL Safe Base64
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(SerializationUtils.serialize(object));
    }

    public static <T> T deserialize(Cookie cookie, Class<T> cls) {
        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(cookie.getValue());
            return cls.cast(SerializationUtils.deserialize(decodedBytes));
        } catch (Exception e) {
            log.error("Step: Deserialize - Critical failure for {}: {}", cookie.getName(), e.getMessage());
            return null;
        }
    }
}

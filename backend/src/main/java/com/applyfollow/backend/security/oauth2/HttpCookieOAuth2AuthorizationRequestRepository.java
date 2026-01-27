package com.applyfollow.backend.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Stores the OAuth2 authorization request in memory using the 'state' parameter
 * as key.
 * This bypasses all browser cookie issues (SameSite, Lax, localhost port
 * mismatches)
 * which were causing the 'authorization_request_not_found' error.
 */
@Component
@Slf4j
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    // Hafıza emanetçisi: state -> istek
    private final Map<String, OAuth2AuthorizationRequest> authorizationRequests = new ConcurrentHashMap<>();

    // Redirect URI'leri için ayrı bir map (opsiyonel ama sağlıklı)
    private final Map<String, String> redirectUris = new ConcurrentHashMap<>();

    // İsteklerin oluşturulma zamanı: state -> timestamp
    private final Map<String, Long> creationTimes = new ConcurrentHashMap<>();

    public static final String REDIRECT_URI_PARAM_COOKIE_NAME = "redirect_uri";

    // Her 5 dakikada bir bayat istekleri temizle
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 300000)
    public void cleanupStaleRequests() {
        long now = System.currentTimeMillis();
        creationTimes.forEach((state, time) -> {
            if (now - time > 300000) { // 5 dakika
                log.info("Cleanup: Removing stale OAuth2 request for state: {}", state);
                authorizationRequests.remove(state);
                redirectUris.remove(state);
                creationTimes.remove(state);
            }
        });
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        Assert.notNull(request, "request cannot be null");
        String state = request.getParameter("state");
        log.info("Step: Load - Incoming state from URL: {}", state);

        if (state == null) {
            log.warn("Step: Load - FAILED! No state parameter found in URL.");
            return null;
        }

        OAuth2AuthorizationRequest authRequest = authorizationRequests.get(state);
        if (authRequest != null) {
            log.info("Step: Load - SUCCESS! Found request in memory for state: {}", state);
            return authRequest;
        }

        log.error("Step: Load - FAILED! No request found in memory for state: {}. Total pending: {}", state,
                authorizationRequests.size());
        return null;
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request,
            HttpServletResponse response) {
        Assert.notNull(request, "request cannot be null");
        Assert.notNull(response, "response cannot be null");

        if (authorizationRequest == null) {
            String state = request.getParameter("state");
            if (state != null) {
                log.debug("Step: Save - Request is null, removing state: {}", state);
                authorizationRequests.remove(state);
                redirectUris.remove(state);
            }
            return;
        }

        String state = authorizationRequest.getState();
        log.info("Step: Save - Storing request in memory with state: {}", state);
        authorizationRequests.put(state, authorizationRequest);
        creationTimes.put(state, System.currentTimeMillis());

        String redirectUri = request.getParameter(REDIRECT_URI_PARAM_COOKIE_NAME);
        if (redirectUri != null && !redirectUri.isBlank()) {
            redirectUris.put(state, redirectUri);
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
            HttpServletResponse response) {
        Assert.notNull(request, "request cannot be null");
        String state = request.getParameter("state");
        if (state != null) {
            log.info("Step: Remove - Cleaning up memory for state: {}", state);
            redirectUris.remove(state);
            creationTimes.remove(state);
            return authorizationRequests.remove(state);
        }
        return null;
    }

    // Gerekli değil ama hata handlerları için arayüzü koruyoruz
    public void removeAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        String state = request.getParameter("state");
        if (state != null) {
            authorizationRequests.remove(state);
            redirectUris.remove(state);
            creationTimes.remove(state);
        }
    }

    public String getRedirectUri(String state) {
        if (state == null)
            return null;
        return redirectUris.get(state);
    }
}

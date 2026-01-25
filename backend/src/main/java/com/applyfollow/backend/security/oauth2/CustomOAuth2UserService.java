package com.applyfollow.backend.security.oauth2;

import com.applyfollow.backend.model.AuthProvider;
import com.applyfollow.backend.model.Role;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            // Hatanın detayını konsola basalım
            System.err.println("OAuth2 User Processing Error: " + ex.getMessage());
            ex.printStackTrace();
            throw new OAuth2AuthenticationException(ex.getMessage() != null ? ex.getMessage() : "Unknown Error");
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        Object idAttribute = oAuth2User.getAttribute("id");
        Object subAttribute = oAuth2User.getAttribute("sub");

        String socialId;
        if (idAttribute != null) {
            socialId = idAttribute.toString();
        } else if (subAttribute != null) {
            socialId = subAttribute.toString();
        } else {
            throw new InternalAuthenticationServiceException(
                    "Attributes 'id' and 'sub' are both missing from OAuth2 provider");
        }

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Fallback for GitHub if email is hidden
        if (email == null && "github".equalsIgnoreCase(registrationId)) {
            email = fetchGitHubEmail(userRequest);
        }

        if (email == null) {
            throw new InternalAuthenticationServiceException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Eğer provider null ise (eski kayıt vb.) veya providerlar eşleşmiyorsa kontrol
            // et
            if (user.getProvider() != null &&
                    !user.getProvider().equals(AuthProvider.valueOf(registrationId.toUpperCase(Locale.ENGLISH))) &&
                    !user.getProvider().equals(AuthProvider.LOCAL)) {

                throw new RuntimeException("Looks like you're signed up with " + user.getProvider()
                        + " account. Please use your " + user.getProvider() + " account to login.");
            }
            user = updateExistingUser(user, name, socialId);
        } else {
            user = registerNewUser(userRequest, name, email, socialId);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private String fetchGitHubEmail(OAuth2UserRequest userRequest) {
        String token = userRequest.getAccessToken().getTokenValue();
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });

            List<Map<String, Object>> emails = response.getBody();
            if (emails != null) {
                for (Map<String, Object> emailObj : emails) {
                    Boolean primary = (Boolean) emailObj.get("primary");
                    Boolean verified = (Boolean) emailObj.get("verified");
                    String email = (String) emailObj.get("email");

                    if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)) {
                        return email;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch GitHub emails: " + e.getMessage());
        }
        return null; // Hala bulamazsa null dönsün
    }

    private User registerNewUser(OAuth2UserRequest userRequest, String name, String email, String socialId) {
        User user = new User();
        user.setFullName(name);
        user.setEmail(email);
        user.setProvider(AuthProvider
                .valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase(Locale.ENGLISH)));
        user.setProviderId(socialId);
        user.setRole(Role.USER);
        user.setActive(true);
        user.setMarketDataConsent(false); // Default false, user can update later
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, String name, String socialId) {
        existingUser.setFullName(name);
        existingUser.setProviderId(socialId); // Update provider ID just in case
        return userRepository.save(existingUser);
    }
}

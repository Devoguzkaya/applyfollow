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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;

@Slf4j
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
            log.error("OAuth2 User Processing Error: ", ex);
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

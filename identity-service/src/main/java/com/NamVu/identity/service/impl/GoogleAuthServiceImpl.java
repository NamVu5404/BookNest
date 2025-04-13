package com.NamVu.identity.service.impl;

import com.NamVu.identity.constant.PredefinedRole;
import com.NamVu.identity.dto.request.auth.ExchangeTokenRequest;
import com.NamVu.identity.dto.request.profile.ProfileCreateRequest;
import com.NamVu.identity.dto.response.auth.AuthenticationResponse;
import com.NamVu.identity.dto.response.auth.ExchangeTokenResponse;
import com.NamVu.identity.dto.response.identity.UserGgResponse;
import com.NamVu.identity.entity.Role;
import com.NamVu.identity.entity.User;
import com.NamVu.identity.httpclient.GoogleAuthClient;
import com.NamVu.identity.httpclient.GoogleUserClient;
import com.NamVu.identity.httpclient.ProfileClient;
import com.NamVu.identity.repository.RoleRepository;
import com.NamVu.identity.repository.UserRepository;
import com.NamVu.identity.service.OutboundAuthService;
import com.NamVu.identity.service.TokenService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service("google")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleAuthServiceImpl implements OutboundAuthService {

    GoogleAuthClient googleAuthClient;
    GoogleUserClient googleUserClient;
    TokenService tokenService;
    UserRepository userRepository;
    ProfileClient profileClient;
    RoleRepository roleRepository;

    @NonFinal
    @Value("${outbound.google.client-id}")
    String GOOGLE_CLIENT_ID;

    @NonFinal
    @Value("${outbound.google.client-secret}")
    String GOOGLE_CLIENT_SECRET;

    @NonFinal
    @Value("${outbound.redirect-uri}")
    String REDIRECT_URI;

    @NonFinal
    String GRANT_TYPE = "authorization_code";

    @Override
    @Transactional
    public AuthenticationResponse outboundAuthentication(String code) {
        // Exchange token
        ExchangeTokenResponse response = exchangeToken(code);

        // Get user info
        UserGgResponse userInfo = getUserInfo(response);

        // Onboard user
        User user = onboardUser(userInfo);

        // Generate JWT
        String token = tokenService.generateToken(user);

        return AuthenticationResponse.builder()
                .userId(user.getId())
                .token(token)
                .build();
    }

    private ExchangeTokenResponse exchangeToken(String code) {
        return googleAuthClient.exchangeToken(ExchangeTokenRequest.builder()
                .clientId(GOOGLE_CLIENT_ID)
                .clientSecret(GOOGLE_CLIENT_SECRET)
                .code(code)
                .grantType(GRANT_TYPE)
                .redirectUri(REDIRECT_URI)
                .build());
    }

    private UserGgResponse getUserInfo(ExchangeTokenResponse response) {
        return googleUserClient.getUserInfo(response.getAccessToken());
    }

    private User onboardUser(UserGgResponse userInfo) {
        return userRepository.findByEmail(userInfo.getEmail()).orElseGet(() -> {
            HashSet<Role> roles = new HashSet<>();
            roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

            User newUser =
                    User.builder().email(userInfo.getEmail()).roles(roles).build();

            newUser = userRepository.save(newUser);

            ProfileCreateRequest profileCreateRequest = ProfileCreateRequest.builder()
                    .userId(newUser.getId())
                    .fullName(userInfo.getName())
                    .avatar(userInfo.getPicture())
                    .build();

            // Tạo profile
            profileClient.create(profileCreateRequest);

            return newUser;
        });
    }
}

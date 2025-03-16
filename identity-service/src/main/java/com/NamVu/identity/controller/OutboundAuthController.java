package com.NamVu.identity.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.identity.dto.response.auth.AuthenticationResponse;
import com.NamVu.identity.service.OutboundAuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/outbound")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OutboundAuthController {

    Map<String, OutboundAuthService> authenticationServiceMap;

    @PostMapping("/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthentication(@RequestParam("provider") String provider,
                                                               @RequestParam("code") String code) {

        OutboundAuthService selectedService = authenticationServiceMap.get(provider);

        AuthenticationResponse result = selectedService.outboundAuthentication(code);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
}

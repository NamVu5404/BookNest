package com.NamVu.identity.controller;

import org.springframework.web.bind.annotation.*;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.identity.dto.request.otp.VerifyEmailRequest;
import com.NamVu.identity.dto.response.otp.VerifyEmailResponse;
import com.NamVu.identity.service.OtpService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/otps")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OtpController {
    OtpService otpService;

    @PostMapping
    public ApiResponse<?> generateOtpCode(@RequestParam("email") String email) {
        otpService.generateOtpCode(email);
        return ApiResponse.builder().build();
    }

    @PostMapping("/verification")
    public ApiResponse<VerifyEmailResponse> verificationOtpCode(@RequestBody VerifyEmailRequest request) {
        return ApiResponse.<VerifyEmailResponse>builder()
                .result(VerifyEmailResponse.builder()
                        .valid(otpService.verificationOtpCode(request))
                        .build())
                .build();
    }
}

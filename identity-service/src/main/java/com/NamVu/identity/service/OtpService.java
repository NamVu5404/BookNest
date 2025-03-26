package com.NamVu.identity.service;

import com.NamVu.identity.dto.request.otp.VerifyEmailRequest;

public interface OtpService {
    void generateOtpCode(String email);

    boolean verificationOtpCode(VerifyEmailRequest request);
}

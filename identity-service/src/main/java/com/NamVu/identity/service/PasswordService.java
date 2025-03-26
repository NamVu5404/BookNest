package com.NamVu.identity.service;

import com.NamVu.identity.dto.request.password.ChangePasswordRequest;
import com.NamVu.identity.dto.request.password.ResetPasswordRequest;

public interface PasswordService {
    void changePassword(ChangePasswordRequest request);

    void setPassword(String password);

    void forgotPassword(ResetPasswordRequest request);
}

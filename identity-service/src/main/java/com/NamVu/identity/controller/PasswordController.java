package com.NamVu.identity.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.identity.dto.request.password.ChangePasswordRequest;
import com.NamVu.identity.dto.request.password.ResetPasswordRequest;
import com.NamVu.identity.dto.request.password.SetPasswordRequest;
import com.NamVu.identity.service.PasswordService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/password")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordController {

    PasswordService passwordService;

    @PutMapping("/change")
    public ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        passwordService.changePassword(request);
        return ApiResponse.<Void>builder().build();
    }

    /**
     * set password cho user login bằng bên thứ 3
     */
    @PutMapping("/set")
    public ApiResponse<Void> setPassword(@RequestBody @Valid SetPasswordRequest request) {
        passwordService.setPassword(request.getPassword());
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/reset")
    public ApiResponse<?> forgotPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordService.forgotPassword(request);
        return ApiResponse.builder().build();
    }
}

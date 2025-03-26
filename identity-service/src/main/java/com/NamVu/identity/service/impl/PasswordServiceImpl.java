package com.NamVu.identity.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.identity.dto.request.password.ChangePasswordRequest;
import com.NamVu.identity.dto.request.password.ResetPasswordRequest;
import com.NamVu.identity.entity.User;
import com.NamVu.identity.repository.UserRepository;
import com.NamVu.identity.service.PasswordService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PasswordServiceImpl implements PasswordService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository
                .findByEmailAndIsActive(email, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void setPassword(String password) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository
                .findByEmailAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (StringUtils.hasText(user.getPassword())) throw new AppException(ErrorCode.PASSWORD_EXISTED);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public void forgotPassword(ResetPasswordRequest request) {
        User user = userRepository
                .findByEmailAndIsActive(request.getEmail(), StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
}

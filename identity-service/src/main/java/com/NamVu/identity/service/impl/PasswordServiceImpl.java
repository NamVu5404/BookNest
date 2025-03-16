package com.NamVu.identity.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.identity.dto.request.password.ChangePasswordRequest;
import com.NamVu.identity.entity.User;
import com.NamVu.identity.repository.UserRepository;
import com.NamVu.identity.service.PasswordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordServiceImpl implements PasswordService {

    static String DEFAULT_PASSWORD = "12345678";

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmailAndIsActive(email, StatusConstant.ACTIVE)
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

        User user = userRepository.findByEmailAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (StringUtils.hasText(user.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_EXISTED);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public void resetPassword(String id) {
        User user = userRepository.findByIdAndIsActive(id, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        userRepository.save(user);
    }

    @Override
    public Object forgotPassword(Object object) {
        return null;
    }
}
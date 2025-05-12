package com.NamVu.identity.service.impl;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.identity.constant.PredefinedRole;
import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.identity.UserUpdateRequest;
import com.NamVu.identity.dto.request.profile.ProfileCreateRequest;
import com.NamVu.identity.dto.response.identity.UserResponse;
import com.NamVu.identity.entity.Role;
import com.NamVu.identity.entity.User;
import com.NamVu.identity.httpclient.ProfileClient;
import com.NamVu.identity.mapper.ProfileMapper;
import com.NamVu.identity.mapper.UserMapper;
import com.NamVu.identity.repository.RoleRepository;
import com.NamVu.identity.repository.UserRepository;
import com.NamVu.identity.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    ProfileMapper profileMapper;
    ProfileClient profileClient;
    KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> getAll(Pageable pageable) {
        Page<User> users = userRepository.findByIsActive(StatusConstant.ACTIVE, pageable);

        return PageResponse.<UserResponse>builder()
                .totalPages(users.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(users.getTotalElements())
                .data(users.stream().map(userMapper::toUserResponse).toList())
                .build();
    }

    @Override
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);
        user = userRepository.save(user);

        ProfileCreateRequest profileCreateRequest = profileMapper.toProfileRequest(request);
        profileCreateRequest.setUserId(user.getId());

        profileClient.create(profileCreateRequest);

        // Publish message to Kafka
        sendWelcomeEmail(request);

        return userMapper.toUserResponse(user);
    }

    @Override
    @PreAuthorize("authentication.name == #id")
    public UserResponse update(String id, UserUpdateRequest request) {
        User user = userRepository
                .findByIdAndIsActive(id, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setIsActive(StatusConstant.INACTIVE);
        userRepository.save(user);

        profileClient.delete(id);
    }

    @Override
    public UserResponse getMyInfo() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository
                .findByIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserResponse response = userMapper.toUserResponse(user);
        response.setHasPassword(StringUtils.hasText(user.getPassword()));
        return response;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getById(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    private void sendWelcomeEmail(UserCreateRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("fullName", request.getFullName());

        NotificationEvent event = NotificationEvent.builder()
                .channel("EMAIL")
                .subject("Welcome to BookNest!")
                .recipient(request.getEmail())
                .templateCode("welcome-email")
                .params(params)
                .build();

        kafkaTemplate.send(KafkaConstant.EMAIL_EVENTS, event);
    }
}

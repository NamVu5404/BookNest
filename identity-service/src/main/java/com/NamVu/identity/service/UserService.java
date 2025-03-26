package com.NamVu.identity.service;

import org.springframework.data.domain.Pageable;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.identity.UserUpdateRequest;
import com.NamVu.identity.dto.response.identity.UserResponse;

public interface UserService {
    PageResponse<UserResponse> getAll(Pageable pageable);

    UserResponse create(UserCreateRequest request);

    UserResponse update(String id, UserUpdateRequest request);

    void delete(String id);

    UserResponse getMyInfo();

    UserResponse getById(String id);
}

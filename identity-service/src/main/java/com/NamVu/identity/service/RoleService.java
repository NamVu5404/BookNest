package com.NamVu.identity.service;

import com.NamVu.identity.dto.request.identity.RoleRequest;
import com.NamVu.identity.dto.response.identity.RoleResponse;

import java.util.List;

public interface RoleService {
    RoleResponse create(RoleRequest request);

    List<RoleResponse> getAll();

    void delete(String role);
}

package com.NamVu.identity.service;

import java.util.List;

import com.NamVu.identity.dto.request.identity.PermissionRequest;
import com.NamVu.identity.dto.response.identity.PermissionResponse;

public interface PermissionService {
    PermissionResponse create(PermissionRequest request);

    List<PermissionResponse> getAll();

    void delete(String permission);
}

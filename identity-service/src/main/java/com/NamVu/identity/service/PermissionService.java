package com.NamVu.identity.service;

import com.NamVu.identity.dto.request.identity.PermissionRequest;
import com.NamVu.identity.dto.response.identity.PermissionResponse;

import java.util.List;

public interface PermissionService {
    PermissionResponse create(PermissionRequest request);

    List<PermissionResponse> getAll();

    void delete(String permission);
}

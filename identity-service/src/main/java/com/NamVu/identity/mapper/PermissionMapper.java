package com.NamVu.identity.mapper;

import org.mapstruct.Mapper;

import com.NamVu.identity.dto.request.PermissionRequest;
import com.NamVu.identity.dto.response.PermissionResponse;
import com.NamVu.identity.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}

package com.NamVu.identity.mapper;

import com.NamVu.identity.dto.request.identity.PermissionRequest;
import com.NamVu.identity.dto.response.identity.PermissionResponse;
import com.NamVu.identity.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}

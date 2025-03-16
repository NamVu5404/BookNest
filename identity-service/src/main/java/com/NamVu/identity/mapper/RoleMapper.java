package com.NamVu.identity.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NamVu.identity.dto.request.RoleRequest;
import com.NamVu.identity.dto.response.RoleResponse;
import com.NamVu.identity.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}

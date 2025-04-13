package com.NamVu.identity.mapper;

import com.NamVu.identity.dto.request.identity.RoleRequest;
import com.NamVu.identity.dto.response.identity.RoleResponse;
import com.NamVu.identity.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}

package com.NamVu.identity.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.identity.UserUpdateRequest;
import com.NamVu.identity.dto.response.identity.UserResponse;
import com.NamVu.identity.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

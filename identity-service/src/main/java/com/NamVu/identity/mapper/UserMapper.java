package com.NamVu.identity.mapper;

import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.identity.UserUpdateRequest;
import com.NamVu.identity.dto.request.profile.ProfileRequest;
import com.NamVu.identity.dto.response.identity.UserResponse;
import com.NamVu.identity.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

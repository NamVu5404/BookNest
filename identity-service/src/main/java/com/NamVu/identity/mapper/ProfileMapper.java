package com.NamVu.identity.mapper;

import org.mapstruct.Mapper;

import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.profile.ProfileCreateRequest;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileCreateRequest toProfileRequest(UserCreateRequest request);
}

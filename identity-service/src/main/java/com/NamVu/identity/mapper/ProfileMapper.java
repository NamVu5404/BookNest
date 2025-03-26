package com.NamVu.identity.mapper;

import org.mapstruct.Mapper;

import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.profile.ProfileRequest;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileRequest toProfileRequest(UserCreateRequest request);
}

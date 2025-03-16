package com.NamVu.identity.mapper;

import com.NamVu.identity.dto.request.identity.UserCreateRequest;
import com.NamVu.identity.dto.request.profile.ProfileRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileRequest toProfileRequest(UserCreateRequest request);
}

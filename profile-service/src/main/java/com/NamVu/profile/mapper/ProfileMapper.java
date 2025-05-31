package com.NamVu.profile.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.PrivateProfileResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.entity.Profile;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileCreateRequest request);

    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest request);

    PublicProfileResponse toPublicProfileResponse(Profile entity);

    PrivateProfileResponse toPrivateProfileResponse(Profile entity);
}

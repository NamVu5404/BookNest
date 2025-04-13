package com.NamVu.profile.mapper;

import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileCreateRequest request);

    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest request);

    ProfileResponse toProfileResponse(Profile entity);
}

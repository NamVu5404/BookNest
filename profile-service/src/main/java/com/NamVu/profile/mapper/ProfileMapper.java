package com.NamVu.profile.mapper;

import com.NamVu.profile.dto.request.ProfileRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileRequest request);

    void updateProfile(@MappingTarget Profile profile, ProfileRequest request);

    ProfileResponse toProfileResponse(Profile entity);
}

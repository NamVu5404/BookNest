package com.NamVu.profile.service;

import java.util.Map;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.PrivateProfileResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;

public interface ProfileService {
    PrivateProfileResponse create(ProfileCreateRequest request);

    PrivateProfileResponse update(String userId, ProfileUpdateRequest request);

    PublicProfileResponse getPublicProfileByUserId(String userId);

    Map<String, PublicProfileResponse> getByUserIds(Set<String> userIds);

    void updateAvatar(MultipartFile file);

    void deleteAvatar();

    void deleteByUserId(String userId);

    PrivateProfileResponse getMyProfile();
}

package com.NamVu.profile.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

public interface ProfileService {
    ProfileResponse create(ProfileCreateRequest request);

    ProfileResponse update(String userId, ProfileUpdateRequest request);

    ProfileResponse getByUserId(String userId);

    Map<String, ProfileResponse> getByUserIds(Set<String> userIds);

    void updateAvatar(MultipartFile file);

    void deleteAvatar();

    void deleteByUserId(String userId);

    PageResponse<ProfileResponse> getAll(Pageable pageable);
}

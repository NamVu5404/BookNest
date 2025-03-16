package com.NamVu.profile.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.profile.dto.request.ProfileRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import org.springframework.data.domain.Pageable;

public interface ProfileService {
    ProfileResponse create(ProfileRequest request);

    ProfileResponse update(String userId, ProfileRequest request);

    ProfileResponse getByUserId(String UserId);

    void deleteByUserId(String userId);

    PageResponse<ProfileResponse> getAll(Pageable pageable);
}

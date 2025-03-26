package com.NamVu.profile.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.profile.dto.request.ProfileRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.entity.Profile;
import com.NamVu.profile.mapper.ProfileMapper;
import com.NamVu.profile.repository.ProfileRepository;
import com.NamVu.profile.service.ProfileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileServiceImpl implements ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;

    @Override
    public ProfileResponse create(ProfileRequest request) {
        Profile profile = profileMapper.toProfile(request);
        profile = profileRepository.save(profile);

        return profileMapper.toProfileResponse(profile);
    }

    @Override
    public ProfileResponse update(String userId, ProfileRequest request) {
        Profile profile = profileRepository
                .findByUserIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));

        profileMapper.updateProfile(profile, request);
        profile.setUserId(userId);

        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }

    @Override
    public ProfileResponse getByUserId(String userId) {
        Profile profile = profileRepository
                .findByUserIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));

        return profileMapper.toProfileResponse(profile);
    }

    @Override
    public void deleteByUserId(String userId) {
        Profile profile = profileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));

        profile.setIsActive(StatusConstant.INACTIVE);
        profileRepository.save(profile);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ProfileResponse> getAll(Pageable pageable) {
        Page<Profile> profiles = profileRepository.findByIsActive(StatusConstant.ACTIVE, pageable);

        return PageResponse.<ProfileResponse>builder()
                .currentPage(profiles.getNumber() + 1)
                .pageSize(profiles.getSize())
                .totalPages(profiles.getTotalPages())
                .totalElements(profiles.getTotalElements())
                .data(profiles.stream().map(profileMapper::toProfileResponse).toList())
                .build();
    }
}

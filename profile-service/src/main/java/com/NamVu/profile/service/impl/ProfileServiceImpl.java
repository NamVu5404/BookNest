package com.NamVu.profile.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.constant.SubDirConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.FileResponse;
import com.NamVu.profile.dto.response.PrivateProfileResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.entity.Profile;
import com.NamVu.profile.httpclient.FileClient;
import com.NamVu.profile.mapper.ProfileMapper;
import com.NamVu.profile.repository.ProfileRepository;
import com.NamVu.profile.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileServiceImpl implements ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    FileClient fileClient;

    @Override
    public PrivateProfileResponse create(ProfileCreateRequest request) {
        Profile profile = profileMapper.toProfile(request);
        profile = profileRepository.save(profile);

        return profileMapper.toPrivateProfileResponse(profile);
    }

    @Override
    @PreAuthorize("#userId == authentication.name")
    public PrivateProfileResponse update(String userId, ProfileUpdateRequest request) {
        Profile profile = getProfile(userId);

        profileMapper.updateProfile(profile, request);
        profile.setUserId(userId);

        return profileMapper.toPrivateProfileResponse(profileRepository.save(profile));
    }

    @Override
    public PublicProfileResponse getPublicProfileByUserId(String userId) {
        return profileMapper.toPublicProfileResponse(getProfile(userId));
    }

    @Override
    public Map<String, PublicProfileResponse> getByUserIds(Set<String> userIds) {
        List<Profile> profiles = profileRepository.findByUserIdInAndIsActive(userIds, StatusConstant.ACTIVE);
        List<PublicProfileResponse> responses = profiles.stream().map(profileMapper::toPublicProfileResponse).toList();
        return responses.stream().collect(Collectors.toMap(PublicProfileResponse::getUserId, profile -> profile));
    }

    @Override
    public void updateAvatar(MultipartFile file) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile profile = getProfile(userId);

        FileResponse fileResponse = null;

        try {
            fileResponse = fileClient.uploadFile(file, SubDirConstant.AVATAR).getResult();
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
        }

        if (fileResponse != null) {
            profile.setAvatar(fileResponse.getUrl());
            profileRepository.save(profile);
        } else {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public void deleteAvatar() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile profile = getProfile(userId);

        profile.setAvatar(null);
        profileRepository.save(profile);
    }

    @Override
    public void deleteByUserId(String userId) {
        Profile profile = getProfile(userId);
        profile.setIsActive(StatusConstant.INACTIVE);
        profileRepository.save(profile);
    }

    @Override
    public PrivateProfileResponse getMyProfile() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile profile = getProfile(userId);

        return profileMapper.toPrivateProfileResponse(profile);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<PrivateProfileResponse> getAll(Pageable pageable) {
        Page<Profile> profiles = profileRepository.findByIsActive(StatusConstant.ACTIVE, pageable);

        return PageResponse.<PrivateProfileResponse>builder()
                .currentPage(profiles.getNumber() + 1)
                .pageSize(profiles.getSize())
                .totalPages(profiles.getTotalPages())
                .totalElements(profiles.getTotalElements())
                .data(profiles.stream().map(profileMapper::toPrivateProfileResponse).toList())
                .build();
    }

    private Profile getProfile(String userId) {
        return profileRepository.findByUserIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));
    }
}

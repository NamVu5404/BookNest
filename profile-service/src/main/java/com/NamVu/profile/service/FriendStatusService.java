package com.NamVu.profile.service;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.entity.Profile;
import com.NamVu.profile.enums.FriendStatus;
import com.NamVu.profile.mapper.ProfileMapper;
import com.NamVu.profile.repository.ProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendStatusService {
    ProfileMapper profileMapper;
    ProfileRepository profileRepository;

    public PublicProfileResponse mapToPublicProfileResponse(Profile profile) {
        var response = profileMapper.toPublicProfileResponse(profile);

        try {
            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            Profile currentProfile = getProfile(currentUserId);

            FriendStatus status = getFriendStatus(currentProfile, profile);
            response.setStatus(status);

        } catch (Exception ignored) {
            response.setStatus(FriendStatus.NONE);
        }

        return response;
    }

    private FriendStatus getFriendStatus(Profile currentProfile, Profile targetProfile) {
        if (isFriend(currentProfile, targetProfile)) {
            return FriendStatus.FRIEND;
        } else if (isSentRequest(currentProfile, targetProfile)) {
            return FriendStatus.SENT;
        } else if (isReceivedRequest(currentProfile, targetProfile)) {
            return FriendStatus.RECEIVED;
        } else {
            return FriendStatus.NONE;
        }
    }

    private boolean isFriend(Profile currentProfile, Profile targetProfile) {
        return currentProfile.getFriends().stream()
                .anyMatch(request -> request.getUserId().equals(targetProfile.getUserId()));
    }

    private boolean isSentRequest(Profile currentProfile, Profile targetProfile) {
        return currentProfile.getSentRequests().stream()
                .anyMatch(request -> request.getReceiver().getUserId().equals(targetProfile.getUserId()));
    }

    private boolean isReceivedRequest(Profile currentProfile, Profile targetProfile) {
        return currentProfile.getReceivedRequests().stream()
                .anyMatch(request -> request.getSenderId().equals(targetProfile.getUserId()));
    }

    private Profile getProfile(String userId) {
        return profileRepository.findByUserIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));
    }
}

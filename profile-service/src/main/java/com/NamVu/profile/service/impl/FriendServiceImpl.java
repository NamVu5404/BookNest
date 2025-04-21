package com.NamVu.profile.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.profile.dto.request.FriendCreateRequest;
import com.NamVu.profile.dto.response.FriendRequestResponse;
import com.NamVu.profile.dto.response.LimitedResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.entity.FriendRequest;
import com.NamVu.profile.entity.Profile;
import com.NamVu.profile.mapper.ProfileMapper;
import com.NamVu.profile.repository.ProfileRepository;
import com.NamVu.profile.service.FriendService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendServiceImpl implements FriendService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;

    @Override
    @Transactional
    public void sendFriendRequest(FriendCreateRequest request) {
        String receiverId = request.getReceiverId();
        String senderId = getCurrentUserId();
        Profile sender = getProfile(senderId);

        // Check gửi kb cho chính mình
        validateNotSelfRequest(sender.getUserId(), receiverId);

        // Check đã là bạn bè chưa
        boolean alreadyFriend = sender.getFriends().stream()
                .anyMatch(friend -> friend.getUserId().equals(receiverId));

        if (alreadyFriend) {
            throw new AppException(ErrorCode.ALREADY_FRIEND);
        }

        // Check đã tồn tại lời mời kb chưa
        boolean alreadyRequested = sender.getSentRequests().stream()
                .anyMatch(friendRequest -> friendRequest.getReceiver().getUserId().equals(receiverId))
                || sender.getReceivedRequests().stream()
                .anyMatch(friendRequest -> friendRequest.getSenderId().equals(receiverId));

        if (alreadyRequested) {
            throw new AppException(ErrorCode.CANNOT_SEND_FRIEND_REQUEST);
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .senderId(sender.getUserId())
                .receiver(getProfile(receiverId))
                .build();

        // Chỉ cần save start node, tự động map relationship và target node
        sender.getSentRequests().add(friendRequest);
        profileRepository.save(sender);
    }

    @Override
    @Transactional
    public void cancelFriendRequest(String receiverId) {
        String senderId = getCurrentUserId();
        profileRepository.deleteFriendRequest(senderId, receiverId);
    }

    @Override
    @Transactional
    public void acceptFriendRequest(String senderId) {
        String receiverId = getCurrentUserId();

        // Thiết lập mqh FRIEND 2 chiều
        profileRepository.createFriendship(senderId, receiverId);

        // Xóa FRIEND_REQUEST
        profileRepository.deleteFriendRequest(senderId, receiverId);
    }

    @Override
    @Transactional
    public void rejectFriendRequest(String senderId) {
        String receiverId = getCurrentUserId();
        profileRepository.deleteFriendRequest(senderId, receiverId);
    }

    @Override
    @Transactional
    public void unfriend(String friendId) {
        String senderId = getCurrentUserId();

        boolean removed = profileRepository.removeFriendRelationship(senderId, friendId);

        if (!removed) {
            throw new AppException(ErrorCode.CANNOT_UNFRIEND);
        }
    }

    @Override
    @PreAuthorize("authentication.name == #userId")
    public Set<FriendRequestResponse> getSentRequests(String userId) {
        Profile profile = getProfile(userId);

        return profile.getSentRequests().stream()
                .map(request ->
                        FriendRequestResponse.builder()
                                .profile(profileMapper.toPublicProfileResponse(request.getReceiver()))
                                .createdAt(request.getCreatedAt())
                                .updatedAt(request.getUpdatedAt())
                                .build()
                )
                .collect(Collectors.toSet());
    }

    @Override
    @PreAuthorize("authentication.name == #userId")
    public Set<FriendRequestResponse> getReceivedRequests(String userId) {
        Profile profile = getProfile(userId);

        return profile.getReceivedRequests().stream()
                .map(request -> FriendRequestResponse.builder()
                        .profile(profileMapper.toPublicProfileResponse(getProfile(request.getSenderId())))
                        .createdAt(request.getCreatedAt())
                        .updatedAt(request.getUpdatedAt())
                        .build()
                )
                .collect(Collectors.toSet());
    }

    @Override
    @PreAuthorize("authentication.name == #userId")
    public LimitedResponse<PublicProfileResponse> getAllFriends(String userId, String lastUserId, int limit) {
        List<Profile> profiles = profileRepository.getAllFriendsAfterLastCreatedAt(userId, lastUserId, limit);

        List<PublicProfileResponse> responses = profiles.stream()
                .map(profileMapper::toPublicProfileResponse)
                .toList();

        return LimitedResponse.<PublicProfileResponse>builder()
                .limit(limit)
                .lastUserId(lastUserId)
                .data(responses)
                .build();
    }

    private Profile getProfile(String userId) {
        return profileRepository.findByUserIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_EXISTED));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void validateNotSelfRequest(String senderId, String receiverId) {
        if (senderId.equals(receiverId)) {
            throw new AppException(ErrorCode.FRIEND_SELF_REQUEST);
        }
    }
}

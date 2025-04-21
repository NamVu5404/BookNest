package com.NamVu.profile.service;

import com.NamVu.profile.dto.request.FriendCreateRequest;
import com.NamVu.profile.dto.response.FriendRequestResponse;
import com.NamVu.profile.dto.response.LimitedResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;

import java.util.Set;

public interface FriendService {
    void sendFriendRequest(FriendCreateRequest request);

    void cancelFriendRequest(String receiverId);

    void acceptFriendRequest(String senderId);

    void rejectFriendRequest(String senderId);

    void unfriend(String friendId);

    Set<FriendRequestResponse> getSentRequests(String userId);

    Set<FriendRequestResponse> getReceivedRequests(String userId);

    LimitedResponse<PublicProfileResponse> getAllFriends(String userId, String lastUserId, int limit);
}

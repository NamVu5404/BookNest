package com.NamVu.profile.service;

import java.util.List;
import java.util.Set;

import com.NamVu.profile.dto.request.FriendCreateRequest;
import com.NamVu.profile.dto.response.LimitedResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;

public interface FriendService {
    void sendFriendRequest(FriendCreateRequest request);

    void cancelFriendRequest(String receiverId);

    void acceptFriendRequest(String senderId);

    void rejectFriendRequest(String senderId);

    void unfriend(String friendId);

    Set<PublicProfileResponse> getSentRequests(String userId);

    Set<PublicProfileResponse> getReceivedRequests(String userId);

    LimitedResponse<PublicProfileResponse> getAllFriends(String userId, String lastUserId, int limit);

    LimitedResponse<PublicProfileResponse> getFriendSuggestions(String userId, String lastUserId, int limit);

    List<String> getAllFriendIds(String userId);
}

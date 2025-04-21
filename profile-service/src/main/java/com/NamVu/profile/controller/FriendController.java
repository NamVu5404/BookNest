package com.NamVu.profile.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.dto.request.FriendCreateRequest;
import com.NamVu.profile.dto.response.FriendRequestResponse;
import com.NamVu.profile.dto.response.LimitedResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.service.FriendService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendController {
    FriendService friendService;

    @PostMapping("/friends/requests")
    public ApiResponse<?> sendFriendRequest(@RequestBody FriendCreateRequest request) {
        friendService.sendFriendRequest(request);
        return ApiResponse.builder().build();
    }

    @DeleteMapping("/friends/requests/{receiverId}")
    public ApiResponse<?> cancelFriendRequest(@PathVariable String receiverId) {
        friendService.cancelFriendRequest(receiverId);
        return ApiResponse.builder().build();
    }

    @PutMapping("/friends/requests/{senderId}")
    public ApiResponse<?> respondFriendRequest(@PathVariable String senderId, @RequestParam String action) {

        if ("accept".equals(action)) {
            friendService.acceptFriendRequest(senderId);
        } else if ("reject".equals(action)) {
            friendService.rejectFriendRequest(senderId);
        } else {
            return ApiResponse.builder()
                    .message("Action not found!")
                    .build();
        }

        return ApiResponse.builder().build();
    }

    @DeleteMapping("/friends/{friendId}")
    public ApiResponse<?> unfriend(@PathVariable String friendId) {
        friendService.unfriend(friendId);
        return ApiResponse.builder().build();
    }

    @GetMapping("/users/{userId}/friends/requests/sent")
    public ApiResponse<Set<FriendRequestResponse>> getSentFriendRequests(@PathVariable String userId) {
        return ApiResponse.<Set<FriendRequestResponse>>builder()
                .result(friendService.getSentRequests(userId))
                .build();
    }

    @GetMapping("/users/{userId}/friends/requests/received")
    public ApiResponse<Set<FriendRequestResponse>> getReceivedFriendRequests(@PathVariable String userId) {
        return ApiResponse.<Set<FriendRequestResponse>>builder()
                .result(friendService.getReceivedRequests(userId))
                .build();
    }

    @GetMapping("/users/{userId}/friends")
    public ApiResponse<LimitedResponse<PublicProfileResponse>> getAllFriends(
            @PathVariable String userId,
            @RequestParam(required = false) String lastUserId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.<LimitedResponse<PublicProfileResponse>>builder()
                .result(friendService.getAllFriends(userId, lastUserId, limit))
                .build();
    }
}

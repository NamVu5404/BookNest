package com.NamVu.profile.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.service.FriendService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InternalFriendController {
    FriendService friendService;

    @GetMapping("/users/{userId}/friend-ids")
    public ApiResponse<List<String>> getAllFriendIds(@PathVariable String userId) {
        return ApiResponse.<List<String>>builder()
                .result(friendService.getAllFriendIds(userId))
                .build();
    }
}

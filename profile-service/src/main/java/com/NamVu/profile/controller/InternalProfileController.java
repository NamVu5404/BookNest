package com.NamVu.profile.controller;

import java.util.Map;
import java.util.Set;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.response.PrivateProfileResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.service.ProfileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalProfileController {
    ProfileService profileService;

    /**
     * Lấy profile theo userId tương ứng
     * - Chỉ cần lấy profile 1 lần nếu có nhiều userId trùng lặp
     *
     * @param userIds userIds
     * @return Map<String, ProfileResponse> userId, ProfileResponse
     */
    @GetMapping("/users/batch")
    public ApiResponse<Map<String, PublicProfileResponse>> getByUserIds(@RequestParam Set<String> userIds) {
        return ApiResponse.<Map<String, PublicProfileResponse>>builder()
                .result(profileService.getByUserIds(userIds))
                .build();
    }

    @PostMapping("/users")
    public ApiResponse<PrivateProfileResponse> create(@RequestBody @Valid ProfileCreateRequest request) {
        return ApiResponse.<PrivateProfileResponse>builder()
                .result(profileService.create(request))
                .build();
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<?> delete(@PathVariable String userId) {
        profileService.deleteByUserId(userId);
        return ApiResponse.builder().build();
    }
}

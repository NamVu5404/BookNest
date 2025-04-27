package com.NamVu.profile.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.PrivateProfileResponse;
import com.NamVu.profile.dto.response.PublicProfileResponse;
import com.NamVu.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @GetMapping("/{userId}")
    public ApiResponse<PublicProfileResponse> getPublicProfileByUserId(@PathVariable String userId) {
        return ApiResponse.<PublicProfileResponse>builder()
                .result(profileService.getPublicProfileByUserId(userId))
                .build();
    }

    @GetMapping("/my-profile")
    public ApiResponse<PrivateProfileResponse> getMyProfile() {
        return ApiResponse.<PrivateProfileResponse>builder()
                .result(profileService.getMyProfile())
                .build();
    }

    @PutMapping("/{userId}")
    public ApiResponse<PrivateProfileResponse> updateProfile(
            @PathVariable String userId, @RequestBody @Valid ProfileUpdateRequest request) {
        return ApiResponse.<PrivateProfileResponse>builder()
                .result(profileService.update(userId, request))
                .build();
    }

    @PatchMapping("/avatar")
    public ApiResponse<?> updateAvatar(@RequestParam("file") MultipartFile file) {
        profileService.updateAvatar(file);
        return ApiResponse.builder().build();
    }

    @DeleteMapping("/avatar")
    public ApiResponse<?> deleteAvatar() {
        profileService.deleteAvatar();
        return ApiResponse.builder().build();
    }
}

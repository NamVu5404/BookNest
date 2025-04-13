package com.NamVu.profile.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.profile.dto.request.ProfileUpdateRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @GetMapping("/users/{userId}")
    public ApiResponse<ProfileResponse> getByUserId(@PathVariable String userId) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getByUserId(userId))
                .build();
    }

    @PutMapping("/users/{userId}")
    public ApiResponse<ProfileResponse> updateProfile(
            @PathVariable String userId, @RequestBody @Valid ProfileUpdateRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.update(userId, request))
                .build();
    }

    @PatchMapping("/users/avatar")
    public ApiResponse<?> updateAvatar(@RequestParam("file") MultipartFile file) {
        profileService.updateAvatar(file);
        return ApiResponse.builder().build();
    }

    @DeleteMapping("/users/avatar")
    public ApiResponse<?> deleteAvatar() {
        profileService.deleteAvatar();
        return ApiResponse.builder().build();
    }

    @GetMapping("/users")
    public ApiResponse<PageResponse<ProfileResponse>> getAll(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);

        return ApiResponse.<PageResponse<ProfileResponse>>builder()
                .result(profileService.getAll(pageable))
                .build();
    }
}

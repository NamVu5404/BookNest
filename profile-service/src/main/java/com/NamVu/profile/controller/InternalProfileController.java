package com.NamVu.profile.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.dto.request.ProfileRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
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

    @PostMapping("/users")
    public ApiResponse<ProfileResponse> create(@RequestBody @Valid ProfileRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.create(request))
                .build();
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<?> delete(@PathVariable String userId) {
        profileService.deleteByUserId(userId);
        return ApiResponse.builder().build();
    }
}

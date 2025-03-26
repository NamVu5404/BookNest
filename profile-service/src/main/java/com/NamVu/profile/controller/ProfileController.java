package com.NamVu.profile.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.profile.dto.request.ProfileRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @PutMapping("/users/{userId}")
    public ApiResponse<ProfileResponse> update(@PathVariable String userId, @RequestBody ProfileRequest request) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.update(userId, request))
                .build();
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<ProfileResponse> getByUserId(@PathVariable String userId) {
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getByUserId(userId))
                .build();
    }

    @GetMapping("/users")
    public ApiResponse<PageResponse<ProfileResponse>> getAll(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);

        return ApiResponse.<PageResponse<ProfileResponse>>builder()
                .result(profileService.getAll(pageable))
                .build();
    }
}

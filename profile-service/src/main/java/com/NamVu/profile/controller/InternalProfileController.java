package com.NamVu.profile.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.dto.request.ProfileCreateRequest;
import com.NamVu.profile.dto.response.ProfileResponse;
import com.NamVu.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalProfileController {
    ProfileService profileService;

    /**
     * Lấy profile theo userId tương ứng
     *
     * @param userIds userIds
     * @return Map<String, ProfileResponse> userId, ProfileResponse
     */
    @GetMapping("/users/batch")
    public ApiResponse<Map<String, ProfileResponse>> getByUserIds(@RequestParam Set<String> userIds) {
        return ApiResponse.<Map<String, ProfileResponse>>builder()
                .result(profileService.getByUserIds(userIds))
                .build();
    }

    @PostMapping("/users")
    public ApiResponse<ProfileResponse> create(@RequestBody @Valid ProfileCreateRequest request) {
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

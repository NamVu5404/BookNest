package com.NamVu.profile.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

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
    ProfileResponse create(@RequestBody @Valid ProfileRequest request) {
        return profileService.create(request);
    }

    @DeleteMapping("/users/{userId}")
    void delete(@PathVariable String userId) {
        profileService.deleteByUserId(userId);
    }
}

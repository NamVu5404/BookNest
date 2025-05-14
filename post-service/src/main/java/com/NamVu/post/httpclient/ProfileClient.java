package com.NamVu.post.httpclient;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.post.configuration.AuthenticationRequestInterceptor;
import com.NamVu.post.dto.response.PrivateProfileResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(
        name = "profile-service",
        url = "${app.services.profile}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileClient {
    @GetMapping("/internal/users/batch")
    ApiResponse<Map<String, PublicProfileResponse>> getByUserIds(@RequestParam Set<String> userIds);

    @GetMapping("/internal/users/{userId}/friend-ids")
    ApiResponse<List<String>> getAllFriendIds(@PathVariable String userId);

    @GetMapping("/users/my-profile")
    ApiResponse<PrivateProfileResponse> getMyProfile();
}

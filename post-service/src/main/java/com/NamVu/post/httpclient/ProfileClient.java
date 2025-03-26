package com.NamVu.post.httpclient;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.post.dto.response.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "profile-service", url = "${app.services.profile}")
public interface ProfileClient {
    @GetMapping("/users/{userId}")
    ApiResponse<ProfileResponse> getProfileByUserId(@PathVariable String userId);
}


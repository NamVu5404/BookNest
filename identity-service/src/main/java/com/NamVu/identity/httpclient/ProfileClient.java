package com.NamVu.identity.httpclient;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.identity.configuration.AuthenticationRequestInterceptor;
import com.NamVu.identity.dto.request.profile.ProfileCreateRequest;
import com.NamVu.identity.dto.response.profile.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "profile-client",
        url = "${app.services.profile}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileClient {
    @PostMapping(value = "/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<ProfileResponse> create(@RequestBody ProfileCreateRequest request);

    @DeleteMapping(value = "/internal/users/{userId}")
    ApiResponse<?> delete(@PathVariable("userId") String userId);
}

package com.NamVu.identity.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.NamVu.identity.dto.response.identity.UserFbResponse;

@FeignClient(name = "facebook-user-client", url = "https://graph.facebook.com/v22.0")
public interface FacebookUserClient {
    @GetMapping("/me")
    UserFbResponse getUserInfo(@RequestParam("fields") String fields, @RequestParam("access_token") String accessToken);
}

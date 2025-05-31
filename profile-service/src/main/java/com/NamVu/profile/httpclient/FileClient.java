package com.NamVu.profile.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.profile.configuaration.AuthenticationRequestInterceptor;
import com.NamVu.profile.dto.response.FileResponse;

@FeignClient(
        name = "file-service",
        url = "${app.services.file-service}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface FileClient {
    @PostMapping(value = "/media/upload/{subDir}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> uploadFile(@RequestPart("file") MultipartFile file, @PathVariable String subDir);
}

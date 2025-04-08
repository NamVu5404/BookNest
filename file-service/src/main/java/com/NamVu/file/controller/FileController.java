package com.NamVu.file.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.file.dto.response.FileData;
import com.NamVu.file.dto.response.FileResponse;
import com.NamVu.file.service.FileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileController {
    FileService fileService;

    @PostMapping("/media/upload")
    public ApiResponse<FileResponse> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.<FileResponse>builder()
                .result(fileService.uploadFile(file))
                .build();
    }

    // Thiết lập cache-control cho file
    // - public: cho phép cache ở trình duyệt và proxy
    // - max-age=31536000: thời gian cache là 1 năm
    // - immutable: nội dung không thay đổi trong thời gian cache, không cần kiểm tra lại với server
    @GetMapping("/media/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        FileData fileData = fileService.downloadFile(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000, immutable")
                .header(HttpHeaders.CONTENT_TYPE, fileData.getContentType())
                .body(fileData.getResource());
    }
}

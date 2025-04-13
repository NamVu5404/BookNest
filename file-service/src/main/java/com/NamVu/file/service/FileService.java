package com.NamVu.file.service;

import com.NamVu.file.dto.response.FileData;
import com.NamVu.file.dto.response.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    FileResponse uploadFile(MultipartFile file, String subDir) throws IOException;

    FileData downloadFile(String fileName) throws IOException;
}

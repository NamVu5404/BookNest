package com.NamVu.file.service.impl;

import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.file.dto.response.FileData;
import com.NamVu.file.dto.response.FileInfo;
import com.NamVu.file.dto.response.FileResponse;
import com.NamVu.file.entity.FileManagement;
import com.NamVu.file.mapper.FileMapper;
import com.NamVu.file.repository.FileManagementRepository;
import com.NamVu.file.repository.FileRepository;
import com.NamVu.file.service.FileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FileServiceImpl implements FileService {
    FileRepository fileRepository;
    FileMapper fileMapper;
    FileManagementRepository fileMgmtRepository;

    @Override
    public FileResponse uploadFile(MultipartFile file) throws IOException {
        // Lưu tệp tải lên vào thư mục đã chỉ định
        FileInfo fileInfo = fileRepository.store(file);

        // Lưu thông tin file vào DBMS
        FileManagement fileManagement = fileMapper.toFileManagement(fileInfo);

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        fileManagement.setOwnerId(userId);

        fileMgmtRepository.save(fileManagement);

        return FileResponse.builder()
                .originalFileName(file.getOriginalFilename())
                .url(fileInfo.getUrl())
                .build();
    }

    @Override
    public FileData downloadFile(String fileName) throws IOException {
        FileManagement fileMgmt = fileMgmtRepository.findById(fileName)
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_FOUND));

        return FileData.builder()
                .contentType(fileMgmt.getContentType())
                .resource(fileRepository.read(fileMgmt))
                .build();
    }
}

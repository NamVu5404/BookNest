package com.NamVu.file.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileInfo {
    String name;
    String contentType;
    long size;
    String md5Checksum; // Kiểm tra tính toàn vẹn của tệp
    String path; // Đường dẫn tệp trên server
    String url; // URL tải xuống tệp
}

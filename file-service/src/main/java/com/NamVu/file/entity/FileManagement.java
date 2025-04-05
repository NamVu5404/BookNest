package com.NamVu.file.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileManagement {
    @MongoId
    String id;
    String contentType;
    String ownerId;
    long size;
    String md5Checksum; // Kiểm tra tính toàn vẹn của tệp
    String path; // Đường dẫn tệp trên server
}

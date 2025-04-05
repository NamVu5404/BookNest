package com.NamVu.file.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileResponse {
    String originalFileName; // Tên tệp gốc
    String url; // URL tải xuống tệp
}

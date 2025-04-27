package com.NamVu.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostEditHistoryResponse {
    String id;
    String postId;
    String content;
    String elapsedTime;
}

package com.NamVu.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostHistoryResponse {
    String id;
    String postId;
    String content;
    String elapsedTime;
    Instant modifiedDate;
}

package com.NamVu.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    String userId;
    String content;
    String elapsedTime;
    Instant createdDate;
    Instant modifiedDate;
    String fullName;
    String avatar;
    boolean updated;
}

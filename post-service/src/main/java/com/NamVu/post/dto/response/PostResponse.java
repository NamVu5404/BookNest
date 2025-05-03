package com.NamVu.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    PublicProfileResponse profile;
    String content;
    String elapsedTime;
    boolean updated;
    int likes;
    int comments;
    boolean liked;
}

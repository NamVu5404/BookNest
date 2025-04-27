package com.NamVu.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentEditHistoryResponse {
    String id;
    String commentId;
    String content;
    String elapsedTime;
}

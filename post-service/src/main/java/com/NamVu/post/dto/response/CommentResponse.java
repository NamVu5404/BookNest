package com.NamVu.post.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentResponse {
    String id;
    String postId;
    String parentId;
    String content;
    int subComment;
    String elapsedTime;
    PublicProfileResponse profile;
    int likes;
    boolean liked;
    boolean updated;
}

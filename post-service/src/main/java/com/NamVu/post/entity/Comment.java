package com.NamVu.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment extends BaseEntity {
    String postId;

    String userId;

    String parentId;

    String content;

    @Builder.Default
    Integer isActive = 1;
}

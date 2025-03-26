package com.NamVu.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document
public class Post {
    @MongoId
    String id;

    String userId;

    String content;

    Instant createdDate;

    Instant modifiedDate;

    @Builder.Default
    Integer isActive = 1;
}

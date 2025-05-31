package com.NamVu.profile.entity;

import java.time.Instant;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.*;
import lombok.experimental.FieldDefaults;

@RelationshipProperties
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequest {
    @Id
    @GeneratedValue
    Long id;

    @TargetNode // Đánh dấu node mà relationship này trỏ tới
    Profile receiver;

    String senderId;

    @Builder.Default
    Instant createdAt = Instant.now();

    @Builder.Default
    Instant updatedAt = Instant.now();
}

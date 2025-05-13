package com.NamVu.notification.entity;

import com.NamVu.notification.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @MongoId
    String id;

    NotificationType type;

    String sender;

    String recipient;

    String subject;

    String content;

    Map<String, Object> data = new HashMap<>();

    boolean isRead = false;

    @Builder.Default
    Instant createdAt = Instant.now();
}

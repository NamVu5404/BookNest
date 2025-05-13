package com.NamVu.event.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationEvent {
    String channel;
    String sender;
    String recipient;
    String templateCode;
    Map<String, Object> params;
    String subject;
    String content;
}

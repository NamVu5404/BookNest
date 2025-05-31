package com.NamVu.event.dto;

import java.util.Map;

import lombok.*;
import lombok.experimental.FieldDefaults;

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

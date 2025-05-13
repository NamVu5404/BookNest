package com.NamVu.notification.consumer;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.notification.entity.Notification;
import com.NamVu.notification.enums.NotificationType;
import com.NamVu.notification.repository.NotificationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationEventListener {
    TemplateEngine templateEngine;
    NotificationRepository notificationRepository;

    @KafkaListener(topics = KafkaConstant.NOTIFICATION_EVENTS, groupId = KafkaConstant.NOTIFICATION_SERVICE)
    public void listenNotificationEvents(NotificationEvent message) {
        log.info("Message: {}", message);

        String htmlContent = renderTemplate(message.getTemplateCode(), message.getParams());

        log.info("Send notification...");

        // Save to db
        notificationRepository.save(Notification.builder()
                .type(NotificationType.IN_APP)
                .sender(message.getSender())
                .recipient(message.getRecipient())
                .subject(message.getSubject())
                .content(htmlContent)
                .data(message.getParams())
                .build());
    }

    private String renderTemplate(String templateCode, Map<String, Object> params) {
        Context context = new Context();
        context.setVariables(params);
        return templateEngine.process("notifications/" + templateCode, context);
    }
}

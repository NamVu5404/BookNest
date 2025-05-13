package com.NamVu.notification.consumer;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.notification.dto.request.Recipient;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.entity.Notification;
import com.NamVu.notification.enums.NotificationType;
import com.NamVu.notification.repository.NotificationRepository;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailEventListener {
    EmailService emailService;
    TemplateEngine templateEngine;
    NotificationRepository notificationRepository;

    @KafkaListener(topics = KafkaConstant.EMAIL_EVENTS, groupId = KafkaConstant.EMAIL_SERVICE)
    public void listenEmailEvents(NotificationEvent message) {
        log.info("Received email: {}", message);

        String htmlContent = renderTemplate(message.getTemplateCode(), message.getParams());
        sendEmail(message, htmlContent);

        // Save to db
        notificationRepository.save(Notification.builder()
                .type(NotificationType.EMAIL)
                .recipient(message.getRecipient())
                .subject(message.getSubject())
                .content(htmlContent)
                .data(message.getParams())
                .build());
    }

    private void sendEmail(NotificationEvent message, String htmlContent) {
        emailService.sendEmail(SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .email(message.getRecipient())
                        .build()))
                .subject(message.getSubject())
                .htmlContent(htmlContent)
                .build());
    }

    private String renderTemplate(String templateCode, Map<String, Object> params) {
        Context context = new Context();
        context.setVariables(params);
        return templateEngine.process(templateCode, context);
    }
}

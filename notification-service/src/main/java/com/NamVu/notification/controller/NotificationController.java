package com.NamVu.notification.controller;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.common.dto.ApiResponse;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.notification.dto.request.Recipient;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.dto.response.EmailResponse;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationController {
    EmailService emailService;
    TemplateEngine templateEngine;

    @KafkaListener(topics = KafkaConstant.EMAIL_EVENTS, groupId = KafkaConstant.EMAIL_SERVICE)
    public ApiResponse<EmailResponse> listenEmailEvents(NotificationEvent message) {
        log.info("Received email: {}", message);
        return ApiResponse.<EmailResponse>builder()
                .result(sendEmail(message))
                .build();
    }

    private EmailResponse sendEmail(NotificationEvent message) {
        String htmlContent = renderTemplate(message.getTemplateCode(), message.getParams());

        return emailService.sendEmail(SendEmailRequest.builder()
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

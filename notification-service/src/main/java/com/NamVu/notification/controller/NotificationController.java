package com.NamVu.notification.controller;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.notification.dto.request.Recipient;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/emails")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationController {
    EmailService emailService;

    @KafkaListener(topics = KafkaConstant.NOTIFICATION_SEND_OTP, groupId = KafkaConstant.OTP_GROUP)
    public void sendOtp(NotificationEvent message) {
        log.info("Received OTP: {}", message);
        sendEmail(message);
    }

    @KafkaListener(topics = KafkaConstant.USER_REGISTRATION_SUCCESS, groupId = KafkaConstant.REGISTRATION_GROUP)
    public void listen(NotificationEvent message) {
        log.info("Received email: {}", message);
        sendEmail(message);
    }

    private void sendEmail(NotificationEvent message) {
        emailService.sendEmail(SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .email(message.getRecipient())
                        .build()))
                .subject(message.getSubject())
                .htmlContent(message.getContent())
                .build());
    }
}

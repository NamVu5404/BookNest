package com.NamVu.notification.service.impl;

import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.notification.dto.request.EmailRequest;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.dto.request.Sender;
import com.NamVu.notification.httpclient.EmailClient;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailServiceImpl implements EmailService {
    EmailClient emailClient;

    @Value("${notification.email.brevo-apikey}")
    @NonFinal
    String API_KEY;

    @Value("${notification.email.email}")
    @NonFinal
    String SENDER_EMAIL;

    @Value("${notification.email.name}")
    @NonFinal
    String SENDER_NAME;

    @Override
    @Async
    public void sendEmail(SendEmailRequest request) {
        Sender sender = Sender.builder()
                .email(SENDER_EMAIL)
                .name(SENDER_NAME)
                .build();

        EmailRequest emailRequest = EmailRequest.builder()
                .sender(sender)
                .to(request.getTo())
                .htmlContent(request.getHtmlContent())
                .subject(request.getSubject())
                .build();

        try {
            emailClient.sendEmail(API_KEY, emailRequest);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.CAN_NOT_SEND_EMAIL);
        }
    }
}

package com.NamVu.notification.service.impl;

import com.NamVu.notification.dto.request.EmailRequest;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.dto.request.Sender;
import com.NamVu.notification.dto.response.EmailResponse;
import com.NamVu.notification.httpclient.EmailClient;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    EmailClient emailClient;

    @NonFinal
    String apiKey = "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";

    @Override
    public EmailResponse sendEmail(SendEmailRequest request) {
        Sender sender = Sender.builder()
                .email("vungocnam542004@gmail.com")
                .name("Vũ Ngọc Nam")
                .build();

        EmailRequest emailRequest = EmailRequest.builder()
                .sender(sender)
                .to(request.getTo())
                .htmlContent(request.getHtmlContent())
                .subject(request.getSubject())
                .build();

        return emailClient.sendEmail(apiKey, emailRequest);

    }
}

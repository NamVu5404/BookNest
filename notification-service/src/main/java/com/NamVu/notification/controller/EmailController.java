package com.NamVu.notification.controller;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.common.dto.ApiResponse;
import com.NamVu.notification.dto.request.Recipient;
import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.dto.response.EmailResponse;
import com.NamVu.notification.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/emails")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailController {
    EmailService emailService;

    @PostMapping
    public ApiResponse<EmailResponse> sendEmail(@RequestBody SendEmailRequest request) {
        return ApiResponse.<EmailResponse>builder()
                .result(emailService.sendEmail(request))
                .build();
    }

    @KafkaListener(topics = KafkaConstant.SEND_OTP, groupId = KafkaConstant.EMAIL_GROUP)
    public void sendOtp(@Header(KafkaHeaders.RECEIVED_KEY) String key, String message) {
        log.info("Send OTP key: {}, message: {}", key, message);

        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .email(key)
                        .build()))
                .subject("Verify OTP")
                .htmlContent("OTP: " + message)
                .build();

        emailService.sendEmail(sendEmailRequest);
    }

    @KafkaListener(topics = KafkaConstant.ONBOARD_USER_SUCCESSFUL, groupId = KafkaConstant.EMAIL_GROUP)
    public void listen(String message) {
        log.info("Received email: {}", message);

        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .name(message)
                        .email(message)
                        .build()))
                .subject("Welcome!")
                .htmlContent("Welcome our new member " + message)
                .build();

        emailService.sendEmail(sendEmailRequest);
    }
}

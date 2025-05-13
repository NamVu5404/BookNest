package com.NamVu.notification.service;

import com.NamVu.notification.dto.request.SendEmailRequest;

public interface EmailService {
    void sendEmail(SendEmailRequest request);
}

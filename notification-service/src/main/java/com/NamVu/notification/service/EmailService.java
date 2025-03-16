package com.NamVu.notification.service;

import com.NamVu.notification.dto.request.SendEmailRequest;
import com.NamVu.notification.dto.response.EmailResponse;

public interface EmailService {
    EmailResponse sendEmail(SendEmailRequest request);
}

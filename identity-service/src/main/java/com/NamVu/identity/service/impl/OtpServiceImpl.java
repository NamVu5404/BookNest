package com.NamVu.identity.service.impl;

import java.time.Instant;
import java.util.Date;
import java.util.Random;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.identity.dto.request.otp.VerifyEmailRequest;
import com.NamVu.identity.entity.InvalidatedOtp;
import com.NamVu.identity.repository.InvalidatedOtpRepository;
import com.NamVu.identity.service.OtpService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OtpServiceImpl implements OtpService {
    InvalidatedOtpRepository invalidatedOtpRepository;
    KafkaTemplate<String, String> kafkaTemplate;

    /**
     * Tạo mã xác thực OTP
     *
     * @param email cần xác thực
     */
    @Override
    public void generateOtpCode(String email) {
        // Xóa các OTP đã tồn tại trước đó
        invalidatedOtpRepository.deleteById(email);

        // Random OTP
        String otpCode = generateOtpCode();

        InvalidatedOtp invalidatedOtp = InvalidatedOtp.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(Date.from(Instant.now().plusSeconds(60 * 5))) // có hiệu lực trong 5p
                .build();

        invalidatedOtpRepository.save(invalidatedOtp);

        // Publish message to Kafka
        log.info("Publishing OTP: key={}, message={}", email, otpCode);
        kafkaTemplate.send(KafkaConstant.SEND_OTP, email, otpCode);
    }

    /**
     * Xác thực mã OTP
     *
     * @param request: email, otp
     * @return true nếu OTP chính xác, số lần thử (attemptCount) > 0 và chưa hết hạn
     */
    @Override
    public boolean verificationOtpCode(VerifyEmailRequest request) {
        InvalidatedOtp invalidatedOtp =
                invalidatedOtpRepository.findById(request.getEmail()).orElse(null);

        if (invalidatedOtp == null) {
            return false;
        }

        if (invalidatedOtp.getOtpCode().equals(request.getOtpCode())
                && invalidatedOtp.getAttemptCount() > 0
                && invalidatedOtp.getExpiryTime().after(new Date())) {
            invalidatedOtpRepository.delete(invalidatedOtp); // xóa OTP khi đã xác thực thành công
            return true;
        }

        invalidatedOtp.setAttemptCount(invalidatedOtp.getAttemptCount() - 1);
        invalidatedOtpRepository.save(invalidatedOtp);
        return false;
    }

    private String generateOtpCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Tạo số từ 100000 đến 999999
        return String.valueOf(otp);
    }
}

package com.NamVu.identity.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class InvalidatedOtp {
    @Id
    String email;

    String otpCode;

    Date expiryTime;

    @Builder.Default
    int attemptCount = 5; // số lần thử tối đa
}

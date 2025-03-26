package com.NamVu.identity.dto.request.profile;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

import com.NamVu.common.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRequest {
    String userId;

    @NotBlank(message = "NAME_NOT_BLANK")
    String fullName;

    String phoneNumber;

    @DobConstraint(min = 3, max = 80, message = "INVALID_DOB")
    LocalDate dob;

    String avatar;

    String bio;
}

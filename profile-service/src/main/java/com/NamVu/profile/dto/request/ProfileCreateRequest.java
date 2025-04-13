package com.NamVu.profile.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreateRequest {
    String userId;

    @NotBlank(message = "NAME_NOT_BLANK")
    String fullName;

    @Pattern(regexp = "^0\\d{9}$", message = "INVALID_PHONE")
    String phoneNumber;
}

package com.NamVu.identity.dto.request.password;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
    @NotBlank(message = "EMAIL_NOT_BLANK")
    String email;

    @NotBlank(message = "PASSWORD_NOT_BLANK")
    @Size(min = 8, max = 32, message = "INVALID_PASSWORD")
    String password;
}

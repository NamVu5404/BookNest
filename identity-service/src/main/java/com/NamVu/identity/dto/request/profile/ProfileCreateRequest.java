package com.NamVu.identity.dto.request.profile;

import jakarta.validation.constraints.NotBlank;
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

    String phoneNumber;

    String avatar;
}

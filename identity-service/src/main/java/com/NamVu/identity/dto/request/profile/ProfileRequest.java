package com.NamVu.identity.dto.request.profile;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRequest {
    String userId;
    String fullName;
    String phoneNumber;
    LocalDate dob;
    String avatar;
}

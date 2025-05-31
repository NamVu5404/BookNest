package com.NamVu.profile.dto.response;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrivateProfileResponse {
    String id;
    String userId;
    String fullName;
    String phoneNumber;
    LocalDate dob;
    String avatar;
    String bio;
}

package com.NamVu.identity.dto.response.profile;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyProfileResponse {
    String id;
    String userId;
    String fullName;
    String phoneNumber;
    LocalDate dob;
    String avatar;
    String bio;
}

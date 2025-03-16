package com.NamVu.profile.dto.request;

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
    String gender;
    String address;
    String avatar;
    String bio;
}

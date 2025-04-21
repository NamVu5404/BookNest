package com.NamVu.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublicProfileResponse {
    String id;
    String userId;
    String fullName;
    LocalDate dob;
    String avatar;
    String bio;
}

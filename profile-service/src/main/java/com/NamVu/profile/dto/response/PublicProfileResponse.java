package com.NamVu.profile.dto.response;

import java.time.LocalDate;

import com.NamVu.profile.enums.FriendStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
    FriendStatus status;
}

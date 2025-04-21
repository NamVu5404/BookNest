package com.NamVu.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequestResponse {
    PublicProfileResponse profile;
    Instant createdAt;
    Instant updatedAt;
}

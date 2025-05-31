package com.NamVu.identity.dto.response.identity;

import java.time.Instant;
import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String email;
    Set<RoleResponse> roles;
    Instant createdDate;
    Instant modifiedDate;

    @Builder.Default
    boolean hasPassword = true;
}

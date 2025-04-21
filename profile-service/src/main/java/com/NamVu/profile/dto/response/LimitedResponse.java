package com.NamVu.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LimitedResponse<T> {
    int limit;
    String lastUserId;

    @Builder.Default
    List<T> data = new ArrayList<>();
}

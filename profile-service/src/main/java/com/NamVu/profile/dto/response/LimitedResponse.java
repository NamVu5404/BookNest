package com.NamVu.profile.dto.response;

import java.util.ArrayList;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

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

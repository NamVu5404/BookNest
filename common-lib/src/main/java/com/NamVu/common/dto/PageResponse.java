package com.NamVu.common.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {
    int totalPages;
    int pageSize;
    int currentPage;
    long totalElements;

    @Builder.Default
    List<T> data = Collections.emptyList();
}


package com.NamVu.post.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.service.LikePostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LikePostController {
    LikePostService likePostService;

    @PostMapping("/{postId}/likes/toggle")
    public ApiResponse<?> toggleLike(@PathVariable String postId, @RequestParam String ownerId) {
        likePostService.toggleLike(postId, ownerId);
        return ApiResponse.builder().build();
    }

    @GetMapping("/{postId}/likes")
    public ApiResponse<PageResponse<PublicProfileResponse>> getAllUserLiked(
            @PathVariable String postId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);

        return ApiResponse.<PageResponse<PublicProfileResponse>>builder()
                .result(likePostService.getAllUserLiked(postId, pageable))
                .build();
    }
}

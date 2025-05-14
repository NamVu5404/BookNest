package com.NamVu.post.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.service.LikeCommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LikeCommentController {
    LikeCommentService likeCommentService;

    @PostMapping("/{commentId}/likes/toggle")
    public ApiResponse<?> toggleLike(@PathVariable String commentId, @RequestParam String ownerId) {
        likeCommentService.toggleLike(commentId, ownerId);
        return ApiResponse.builder().build();
    }

    @GetMapping("/{commentId}/likes")
    public ApiResponse<PageResponse<PublicProfileResponse>> getAllUserLiked(
            @PathVariable String commentId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);

        return ApiResponse.<PageResponse<PublicProfileResponse>>builder()
                .result(likeCommentService.getAllUserLiked(commentId, pageable))
                .build();
    }
}

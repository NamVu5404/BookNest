package com.NamVu.post.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.request.CommentRequest;
import com.NamVu.post.dto.response.CommentEditHistoryResponse;
import com.NamVu.post.dto.response.CommentResponse;
import com.NamVu.post.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentController {
    CommentService commentService;

    @PostMapping("/{postId}/comments")
    public ApiResponse<CommentResponse> createComment(@PathVariable String postId,
                                                      @RequestParam String ownerId,
                                                      @RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(postId, request, ownerId))
                .build();
    }

    @PutMapping("/comments/{id}")
    public ApiResponse<CommentResponse> updateComment(@PathVariable String id,
                                                      @RequestBody CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(id, request))
                .build();
    }

    @DeleteMapping("/comments/{id}")
    public ApiResponse<?> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return ApiResponse.builder().build();
    }

    @GetMapping("/{postId}/comments/all")
    public ApiResponse<PageResponse<CommentResponse>> getAllCommentsByPostId(
            @PathVariable String postId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getAllCommentsByPostId(postId, pageable))
                .build();
    }

    @GetMapping("/comments/{id}/sub-comments/all")
    public ApiResponse<PageResponse<CommentResponse>> getSubCommentByParentId(
            @PathVariable String id,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getSubCommentByParentId(id, pageable))
                .build();
    }

    @GetMapping("/comments/{id}/edit-history")
    public ApiResponse<PageResponse<CommentEditHistoryResponse>> getEditHistoryByCommentId(
            @PathVariable String id,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "modifiedDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<CommentEditHistoryResponse>>builder()
                .result(commentService.getEditHistoryByCommentId(id, pageable))
                .build();
    }
}

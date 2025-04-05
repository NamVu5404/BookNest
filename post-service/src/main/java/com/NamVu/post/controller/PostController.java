package com.NamVu.post.controller;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.request.PostRequest;
import com.NamVu.post.dto.response.PostHistoryResponse;
import com.NamVu.post.dto.response.PostResponse;
import com.NamVu.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getAll(pageable))
                .build();
    }

    @GetMapping("/users/{id}")
    public ApiResponse<PageResponse<PostResponse>> getByUserId(
            @PathVariable("id") String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getByUserId(userId, pageable))
                .build();
    }

    @GetMapping("/{postId}/history")
    public ApiResponse<PageResponse<PostHistoryResponse>> getHistoryByPostId(
            @PathVariable String postId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "modifiedDate");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<PostHistoryResponse>>builder()
                .result(postService.getHistoryByPostId(postId, pageable))
                .build();
    }

    @PostMapping
    public ApiResponse<PostResponse> create(@RequestBody PostRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PostResponse> update(@PathVariable String id, @RequestBody PostRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        postService.delete(id);
        return ApiResponse.builder().build();
    }
}

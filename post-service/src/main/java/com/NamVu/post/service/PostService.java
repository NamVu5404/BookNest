package com.NamVu.post.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.request.PostRequest;
import com.NamVu.post.dto.response.PostHistoryResponse;
import com.NamVu.post.dto.response.PostResponse;
import org.springframework.data.domain.Pageable;

public interface PostService {
    PageResponse<PostResponse> getAll(Pageable pageable);

    PageResponse<PostResponse> getByUserId(String userId, Pageable pageable);

    PageResponse<PostHistoryResponse> getHistoryByPostId(String postId, Pageable pageable);

    PostResponse create(PostRequest request);

    PostResponse update(String id, PostRequest request);

    void delete(String id);
}

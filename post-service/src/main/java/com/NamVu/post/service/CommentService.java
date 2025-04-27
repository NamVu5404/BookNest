package com.NamVu.post.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.request.CommentRequest;
import com.NamVu.post.dto.response.CommentEditHistoryResponse;
import com.NamVu.post.dto.response.CommentResponse;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentResponse createComment(String postId, CommentRequest request);

    CommentResponse updateComment(String id, CommentRequest request);

    void deleteComment(String id);

    PageResponse<CommentResponse> getAllCommentsByPostId(String postId, Pageable pageable);

    PageResponse<CommentResponse> getSubCommentByParentId(String parentId, Pageable pageable);

    PageResponse<CommentEditHistoryResponse> getEditHistoryByCommentId(String commentId, Pageable pageable);
}

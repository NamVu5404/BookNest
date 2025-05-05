package com.NamVu.post.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import org.springframework.data.domain.Pageable;

public interface LikeCommentService {
    void toggleLike(String commentId);

    PageResponse<PublicProfileResponse> getAllUserLiked(String commentId, Pageable pageable);
}

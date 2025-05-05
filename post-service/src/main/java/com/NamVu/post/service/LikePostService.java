package com.NamVu.post.service;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import org.springframework.data.domain.Pageable;

public interface LikePostService {
    void toggleLike(String postId);

    PageResponse<PublicProfileResponse> getAllUserLiked(String postId, Pageable pageable);
}

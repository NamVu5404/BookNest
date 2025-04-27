package com.NamVu.post.service.impl;

import com.NamVu.common.dto.PageResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.entity.Like;
import com.NamVu.post.httpclient.ProfileClient;
import com.NamVu.post.repository.LikeRepository;
import com.NamVu.post.service.LikeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class LikeServiceImpl implements LikeService {
    LikeRepository likeRepository;
    ProfileClient profileClient;

    @Override
    public void toggleLike(String postId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Like existingLike = likeRepository.findByPostIdAndUserId(postId, userId).orElse(null);

        if (existingLike == null) {
            // like
            Like like = Like.builder()
                    .postId(postId)
                    .userId(userId)
                    .build();

            likeRepository.save(like);
        } else {
            // unlike
            likeRepository.delete(existingLike);
        }
    }

    @Override
    public PageResponse<PublicProfileResponse> getAllUserLiked(String postId, Pageable pageable) {
        Page<Like> likes = likeRepository.findAllByPostId(postId, pageable);

        // Lấy userIds liked post
        Set<String> userIds = likes.getContent().stream()
                .map(Like::getUserId)
                .collect(Collectors.toSet());

        // Lấy profile dựa vào Set userIds
        Map<String, PublicProfileResponse> response = profileClient.getByUserIds(userIds).getResult();

        List<PublicProfileResponse> profiles = new ArrayList<>(response.values());

        return PageResponse.<PublicProfileResponse>builder()
                .currentPage(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalPages(likes.getTotalPages())
                .totalElements(likes.getTotalElements())
                .data(profiles)
                .build();
    }
}

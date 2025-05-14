package com.NamVu.post.service.impl;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.entity.LikeComment;
import com.NamVu.post.httpclient.ProfileClient;
import com.NamVu.post.repository.LikeCommentRepository;
import com.NamVu.post.service.LikeCommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
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
public class LikeCommentServiceImpl implements LikeCommentService {
    LikeCommentRepository likeCommentRepository;
    ProfileClient profileClient;
    KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void toggleLike(String commentId, String ownerId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        LikeComment existingLikeComment = likeCommentRepository
                .findByCommentIdAndUserId(commentId, userId)
                .orElse(null);

        if (existingLikeComment == null) {
            // like
            LikeComment likeComment = LikeComment.builder()
                    .commentId(commentId)
                    .userId(userId)
                    .build();

            likeCommentRepository.save(likeComment);

            // publish notification
            if (userId.equals(ownerId)) {
                return; // Ko push event khi user tự like comment mình
            }

            NotificationEvent event = NotificationEvent.builder()
                    .channel("IN_APP")
                    .sender(userId)
                    .recipient(ownerId)
                    .templateCode("like-comment")
                    .params(Map.of("senderName", profileClient.getMyProfile().getResult().getFullName()))
                    .subject("Có người đã thích bình luận của bạn")
                    .build();

            kafkaTemplate.send(KafkaConstant.NOTIFICATION_EVENTS, event);
        } else {
            // unlike
            likeCommentRepository.delete(existingLikeComment);
        }
    }

    @Override
    public PageResponse<PublicProfileResponse> getAllUserLiked(String commentId, Pageable pageable) {
        Page<LikeComment> likes = likeCommentRepository.findAllByCommentId(commentId, pageable);

        // Lấy userIds liked comment
        Set<String> userIds = likes.getContent().stream()
                .map(LikeComment::getUserId)
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

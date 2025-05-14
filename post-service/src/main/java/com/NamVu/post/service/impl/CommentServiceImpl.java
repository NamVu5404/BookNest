package com.NamVu.post.service.impl;

import com.NamVu.common.constant.KafkaConstant;
import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.event.dto.NotificationEvent;
import com.NamVu.post.dto.request.CommentRequest;
import com.NamVu.post.dto.response.CommentEditHistoryResponse;
import com.NamVu.post.dto.response.CommentResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.entity.Comment;
import com.NamVu.post.entity.CommentEditHistory;
import com.NamVu.post.entity.LikeComment;
import com.NamVu.post.httpclient.ProfileClient;
import com.NamVu.post.mapper.CommentMapper;
import com.NamVu.post.repository.CommentEditHistoryRepository;
import com.NamVu.post.repository.CommentRepository;
import com.NamVu.post.repository.LikeCommentRepository;
import com.NamVu.post.service.CommentService;
import com.NamVu.post.service.DateTimeFormatter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentServiceImpl implements CommentService {
    CommentRepository commentRepository;
    CommentEditHistoryRepository commentEditHistoryRepository;
    ProfileClient profileClient;
    CommentMapper commentMapper;
    DateTimeFormatter dateTimeFormatter;
    LikeCommentRepository likeCommentRepository;
    KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public CommentResponse createComment(String postId, CommentRequest request, String ownerId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Comment comment = Comment.builder()
                .postId(postId)
                .parentId(request.getParentId())
                .userId(userId)
                .content(request.getContent())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .build();

        comment = commentRepository.save(comment);

        // Lưu bản gốc
        saveCommentEditHistory(comment);

        CommentResponse response = toResponse(comment);

        // Publish notification
        if (!ownerId.equals(userId)) { // bỏ qua notify khi comment post hoặc trả lời comment chính mình
            NotificationEvent event = NotificationEvent.builder()
                    .channel("IN_APP")
                    .sender(userId)
                    .recipient(ownerId)
                    .templateCode("commented")
                    .params(Map.of("senderName", response.getProfile().getFullName()))
                    .subject("Bình luận liên quan đến nội dung của bạn")
                    .build();

            kafkaTemplate.send(KafkaConstant.NOTIFICATION_EVENTS, event);
        }

        return response;
    }

    @Override
    public CommentResponse updateComment(String id, CommentRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        // Chỉ được update Comment của chính mình
        if (!userId.equals(comment.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        comment.setContent(request.getContent());
        comment.setModifiedDate(Instant.now());
        comment = commentRepository.save(comment);

        // Lưu lịch sử chỉnh sửa Comment
        saveCommentEditHistory(comment);

        return toResponse(comment);
    }

    @Override
    public void deleteComment(String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        // Chỉ được xóa Comment của chính mình
        if (!userId.equals(comment.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        comment.setIsActive(StatusConstant.INACTIVE);
        commentRepository.save(comment);
    }

    @Override
    public PageResponse<CommentResponse> getAllCommentsByPostId(String postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByPostIdAndParentIdIsNull(postId, pageable);

        return PageResponse.<CommentResponse>builder()
                .totalPages(comments.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(comments.getTotalElements())
                .data(toResponse(comments))
                .build();
    }

    @Override
    public PageResponse<CommentResponse> getSubCommentByParentId(String parentId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByParentId(parentId, pageable);

        return PageResponse.<CommentResponse>builder()
                .totalPages(comments.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(comments.getTotalElements())
                .data(toResponse(comments))
                .build();
    }

    @Override
    public PageResponse<CommentEditHistoryResponse> getEditHistoryByCommentId(String commentId, Pageable pageable) {
        if (!commentRepository.existsByIdAndIsActive(commentId, StatusConstant.ACTIVE)) { // check comment đã bị xóa
            throw new AppException(ErrorCode.COMMENT_NOT_EXISTED);
        }

        Page<CommentEditHistory> histories = commentEditHistoryRepository.findByCommentId(commentId, pageable);

        return PageResponse.<CommentEditHistoryResponse>builder()
                .totalPages(histories.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(histories.getTotalElements())
                .data(histories.stream()
                        .map(commentEditHistory ->
                                commentMapper.toCommentEditHistoryResponse(commentEditHistory,
                                        dateTimeFormatter.format(commentEditHistory.getModifiedDate())))
                        .toList())
                .build();
    }

    private void saveCommentEditHistory(Comment comment) {
        CommentEditHistory commentEditHistory = CommentEditHistory.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .modifiedDate(Instant.now())
                .build();

        commentEditHistoryRepository.save(commentEditHistory);
    }

    private CommentResponse toResponse(Comment comment) {
        Map<String, PublicProfileResponse> profiles =
                profileClient.getByUserIds(Set.of(comment.getUserId())).getResult();

        return mapToResponse(comment, profiles);
    }

    private List<CommentResponse> toResponse(Page<Comment> comments) {
        Set<String> userIds = comments.stream()
                .map(Comment::getUserId)
                .collect(Collectors.toSet());

        Map<String, PublicProfileResponse> profiles = profileClient.getByUserIds(userIds).getResult();

        // Tìm comment đã liked của user hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<String> likedCommentIds = new ArrayList<>();

        if (authentication != null) {
            List<String> commentIds = comments.getContent()
                    .stream()
                    .map(Comment::getId)
                    .toList();

            String currentUserId = authentication.getName();

            likedCommentIds = likeCommentRepository.findByUserIdAndCommentIdIn(currentUserId, commentIds)
                    .stream()
                    .map(LikeComment::getCommentId)
                    .toList();
        }

        final List<String> finalLikedCommentIds = likedCommentIds;

        return comments.stream()
                .map(comment -> {
                    CommentResponse commentResponse = mapToResponse(comment, profiles);
                    commentResponse.setLiked(finalLikedCommentIds.contains(commentResponse.getId()));
                    return commentResponse;
                })
                .toList();
    }

    private CommentResponse mapToResponse(Comment comment, Map<String, PublicProfileResponse> profiles) {
        if (StatusConstant.INACTIVE.equals(comment.getIsActive())) { // Comment đã bị xóa
            return commentDeleted(comment);
        }

        CommentResponse response = commentMapper.toCommentResponse(comment);

        response.setSubComment(commentRepository.countByParentId(comment.getId()));
        response.setElapsedTime(dateTimeFormatter.format(comment.getCreatedDate()));
        response.setUpdated(!comment.getCreatedDate().equals(comment.getModifiedDate()));
        response.setLikes(likeCommentRepository.countByCommentId(comment.getId()));

        // Gán Profile từ map đã có
        PublicProfileResponse profile = profiles.get(comment.getUserId());

        if (profile != null) {
            response.setProfile(profile);
        } else {
            throw new AppException(ErrorCode.PROFILE_NOT_EXISTED);
        }

        return response;
    }

    private CommentResponse commentDeleted(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .parentId(comment.getParentId())
                .subComment(commentRepository.countByParentId(comment.getId()))
                .build();
    }
}

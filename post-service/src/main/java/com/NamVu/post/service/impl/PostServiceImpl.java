package com.NamVu.post.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.post.dto.request.PostRequest;
import com.NamVu.post.dto.response.PostEditHistoryResponse;
import com.NamVu.post.dto.response.PostResponse;
import com.NamVu.post.dto.response.PublicProfileResponse;
import com.NamVu.post.entity.Post;
import com.NamVu.post.entity.PostEditHistory;
import com.NamVu.post.httpclient.ProfileClient;
import com.NamVu.post.mapper.PostMapper;
import com.NamVu.post.repository.CommentRepository;
import com.NamVu.post.repository.LikeRepository;
import com.NamVu.post.repository.PostEditHistoryRepository;
import com.NamVu.post.repository.PostRepository;
import com.NamVu.post.service.DateTimeFormatter;
import com.NamVu.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostServiceImpl implements PostService {
    PostRepository postRepository;
    PostMapper postMapper;
    DateTimeFormatter dateTimeFormatter;
    ProfileClient profileClient;
    PostEditHistoryRepository postEditHistoryRepository;
    LikeRepository likeRepository;
    CommentRepository commentRepository;

    @Override
    public PageResponse<PostResponse> getAll(Pageable pageable) {
        Page<Post> posts = postRepository.findByIsActive(StatusConstant.ACTIVE, pageable);

        return PageResponse.<PostResponse>builder()
                .totalPages(posts.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(posts.getTotalElements())
                .data(toResponse(posts))
                .build();
    }

    @Override
    public PageResponse<PostResponse> getByUserId(String userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByUserIdAndIsActive(userId, StatusConstant.ACTIVE, pageable);

        return PageResponse.<PostResponse>builder()
                .totalPages(posts.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(posts.getTotalElements())
                .data(toResponse(posts))
                .build();
    }

    @Override
    public PageResponse<PostEditHistoryResponse> getHistoryByPostId(String postId, Pageable pageable) {
        Page<PostEditHistory> postHistories = postEditHistoryRepository.findByPostId(postId, pageable);

        return PageResponse.<PostEditHistoryResponse>builder()
                .totalPages(postHistories.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(postHistories.getTotalElements())
                .data(postHistories.stream()
                        .map(postEditHistory -> postMapper.toPostEditHistoryResponse(postEditHistory,
                                dateTimeFormatter.format(postEditHistory.getModifiedDate())))
                        .toList())
                .build();
    }

    @Override
    public PostResponse create(PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Post post = Post.builder()
                .userId(userId)
                .content(request.getContent())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .build();

        post = postRepository.save(post);

        // Lưu bản gốc
        savePostEditHistory(post);

        return toResponse(post);
    }

    @Override
    public PostResponse update(String id, PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post post = postRepository.findByIdAndIsActive(id, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        // Chỉ được update Post của chính mình
        if (!authentication.getName().equals(post.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        post.setContent(request.getContent());
        post.setModifiedDate(Instant.now());
        post = postRepository.save(post);

        // Lưu lịch sử chỉnh sửa Post
        savePostEditHistory(post);

        return toResponse(post);
    }

    @Override
    public void delete(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        // Chỉ được xóa Post của chính mình
        if (!authentication.getName().equals(post.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        post.setIsActive(StatusConstant.INACTIVE);
        postRepository.save(post);
    }

    private void savePostEditHistory(Post post) {
        PostEditHistory postEditHistory = PostEditHistory.builder()
                .postId(post.getId())
                .content(post.getContent())
                .modifiedDate(post.getModifiedDate())
                .build();
        postEditHistoryRepository.save(postEditHistory);
    }

    private PostResponse toResponse(Post post) {
        Map<String, PublicProfileResponse> profiles = profileClient.getByUserIds(Set.of(post.getUserId())).getResult();
        return mapToResponse(post, profiles);
    }

    private List<PostResponse> toResponse(Page<Post> posts) {
        Set<String> userIds = posts.stream()
                .map(Post::getUserId)
                .collect(Collectors.toSet());

        Map<String, PublicProfileResponse> profiles = profileClient.getByUserIds(userIds).getResult();

        return posts.stream()
                .map(post -> mapToResponse(post, profiles))
                .toList();
    }

    private PostResponse mapToResponse(Post post, Map<String, PublicProfileResponse> profiles) {
        PostResponse response = postMapper.toPostResponse(post);

        response.setElapsedTime(dateTimeFormatter.format(post.getCreatedDate()));
        response.setUpdated(!post.getCreatedDate().equals(post.getModifiedDate()));
        response.setLikes(likeRepository.countByPostId(post.getId()));
        response.setComments(commentRepository.countByPostIdAndIsActive(post.getId(), StatusConstant.ACTIVE));

        // Gán profile từ map đã có
        PublicProfileResponse profile = profiles.get(post.getUserId());

        if (profile != null) {
            response.setProfile(profile);
        } else {
            throw new AppException(ErrorCode.PROFILE_NOT_EXISTED);
        }

        return response;
    }
}

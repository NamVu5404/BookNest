package com.NamVu.post.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.post.dto.request.PostRequest;
import com.NamVu.post.dto.response.PostHistoryResponse;
import com.NamVu.post.dto.response.PostResponse;
import com.NamVu.post.dto.response.ProfileResponse;
import com.NamVu.post.entity.Post;
import com.NamVu.post.entity.PostHistory;
import com.NamVu.post.httpclient.ProfileClient;
import com.NamVu.post.mapper.PostMapper;
import com.NamVu.post.repository.PostHistoryRepository;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostServiceImpl implements PostService {
    PostRepository postRepository;
    PostMapper postMapper;
    DateTimeFormatter dateTimeFormatter;
    ProfileClient profileClient;
    PostHistoryRepository postHistoryRepository;

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
    public PageResponse<PostHistoryResponse> getHistoryByPostId(String postId, Pageable pageable) {
        Page<PostHistory> postHistories = postHistoryRepository.findByPostId(postId, pageable);

        return PageResponse.<PostHistoryResponse>builder()
                .totalPages(postHistories.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(postHistories.getTotalElements())
                .data(postHistories.stream()
                        .map(postHistory -> postMapper.toPostHistoryResponse(postHistory,
                                dateTimeFormatter.format(postHistory.getModifiedDate())))
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
        savePostHistory(post);

        return toResponse(post);
    }

    @Override
    public PostResponse update(String id, PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        // Chỉ được update Post của chính mình
        if (!authentication.getName().equals(post.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        post.setContent(request.getContent());
        post.setModifiedDate(Instant.now());
        post = postRepository.save(post);

        // Lưu lịch sử chỉnh sửa Post
        savePostHistory(post);

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

    private void savePostHistory(Post post) {
        PostHistory postHistory = PostHistory.builder()
                .postId(post.getId())
                .content(post.getContent())
                .modifiedDate(post.getModifiedDate())
                .build();
        postHistoryRepository.save(postHistory);
    }

    private PostResponse toResponse(Post post) {
        PostResponse response = postMapper.toPostResponse(post);
        response.setElapsedTime(dateTimeFormatter.format(post.getCreatedDate()));
        response.setUpdated(!post.getCreatedDate().equals(post.getModifiedDate()));

        return addProfileToPostResponse(post.getUserId(), response);
    }

    private List<PostResponse> toResponse(Page<Post> posts) {
        return posts.stream()
                .map(this::toResponse)
                .toList();
    }

    private PostResponse addProfileToPostResponse(String userId, PostResponse postResponse) {
        ProfileResponse profile = null;

        try {
            // Lấy thông tin profile của user
            profile = profileClient.getProfileByUserId(userId).getResult();
        } catch (Exception e) {
            log.error("Error when calling profile service: {}", e.getMessage());
        }

        if (profile != null) {
            postResponse.setFullName(profile.getFullName());
            postResponse.setAvatar(profile.getAvatar());
        }

        return postResponse;
    }
}

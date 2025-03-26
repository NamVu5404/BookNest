package com.NamVu.post.service.impl;

import com.NamVu.common.constant.StatusConstant;
import com.NamVu.common.dto.PageResponse;
import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import com.NamVu.post.dto.request.PostRequest;
import com.NamVu.post.dto.response.PostResponse;
import com.NamVu.post.entity.Post;
import com.NamVu.post.mapper.PostMapper;
import com.NamVu.post.repository.PostRepository;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostServiceImpl implements PostService {
    PostRepository postRepository;
    PostMapper postMapper;

    @Override
    public PageResponse<PostResponse> getAll(Pageable pageable) {
        Page<Post> posts = postRepository.findByIsActive(StatusConstant.ACTIVE, pageable);

        return PageResponse.<PostResponse>builder()
                .totalPages(posts.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(posts.getTotalElements())
                .data(posts.stream().map(postMapper::toPostResponse).toList())
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
                .data(posts.stream().map(postMapper::toPostResponse).toList())
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

        return postMapper.toPostResponse(post);
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

        return postMapper.toPostResponse(post);
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
}

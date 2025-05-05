package com.NamVu.post.repository;

import com.NamVu.post.entity.LikePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikePostRepository extends MongoRepository<LikePost, String> {
    Optional<LikePost> findByPostIdAndUserId(String postId, String userId);

    int countByPostId(String postId);

    Page<LikePost> findAllByPostId(String postId, Pageable pageable);

    List<LikePost> findByUserIdAndPostIdIn(String userId, List<String> postId);
}

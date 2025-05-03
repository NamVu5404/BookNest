package com.NamVu.post.repository;

import com.NamVu.post.entity.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    int countByPostId(String postId);

    Page<Like> findAllByPostId(String postId, Pageable pageable);

    List<Like> findByUserIdAndPostIdIn(String userId, List<String> postId);
}

package com.NamVu.post.repository;

import com.NamVu.post.entity.LikeComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeCommentRepository extends MongoRepository<LikeComment, String> {
    Optional<LikeComment> findByCommentIdAndUserId(String commentId, String userId);

    int countByCommentId(String commentId);

    Page<LikeComment> findAllByCommentId(String commentId, Pageable pageable);

    List<LikeComment> findByUserIdAndCommentIdIn(String userId, List<String> commentId);
}

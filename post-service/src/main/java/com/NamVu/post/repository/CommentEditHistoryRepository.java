package com.NamVu.post.repository;

import com.NamVu.post.entity.CommentEditHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentEditHistoryRepository extends MongoRepository<CommentEditHistory, String> {
    Page<CommentEditHistory> findByCommentId(String commentId, Pageable pageable);
}

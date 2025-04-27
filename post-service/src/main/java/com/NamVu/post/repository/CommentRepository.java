package com.NamVu.post.repository;

import com.NamVu.post.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByParentId(String parentId, Pageable pageable);

    Page<Comment> findByPostIdAndParentIdIsNull(String post, Pageable pageable);

    int countByParentId(String parentId);

    int countByPostIdAndIsActive(String postId, Integer isActive);

    boolean existsByIdAndIsActive(String id, Integer isActive);
}

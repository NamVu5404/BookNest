package com.NamVu.post.repository;

import com.NamVu.post.entity.PostEditHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostEditHistoryRepository extends MongoRepository<PostEditHistory, String> {
    Page<PostEditHistory> findByPostId(String postId, Pageable pageable);
}

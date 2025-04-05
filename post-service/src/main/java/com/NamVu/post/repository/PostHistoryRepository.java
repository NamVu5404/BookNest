package com.NamVu.post.repository;

import com.NamVu.post.entity.PostHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostHistoryRepository extends MongoRepository<PostHistory, String> {
    Page<PostHistory> findByPostId(String postId, Pageable pageable);
}

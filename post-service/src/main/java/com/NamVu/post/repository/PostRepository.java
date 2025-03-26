package com.NamVu.post.repository;

import com.NamVu.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByIsActive(Integer isActive, Pageable pageable);

    Page<Post> findByUserIdAndIsActive(String userId, Integer isActive, Pageable pageable);
}

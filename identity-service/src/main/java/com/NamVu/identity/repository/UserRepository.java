package com.NamVu.identity.repository;

import com.NamVu.identity.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Page<User> findByIsActive(Integer isActive, Pageable pageable);

    Optional<User> findByEmailAndIsActive(String email, Integer isActive);

    Optional<User> findByIdAndIsActive(String id, Integer isActive);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}

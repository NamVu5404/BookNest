package com.NamVu.profile.repository;

import com.NamVu.profile.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProfileRepository extends Neo4jRepository<Profile, String> {
    Optional<Profile> findByUserIdAndIsActive(String userId, Integer isActive);

    Optional<Profile> findByUserId(String userId);

    Page<Profile> findByIsActive(Integer isActive, Pageable pageable);

    List<Profile> findByUserIdInAndIsActive(Set<String> userIds, Integer isActive);
}

package com.NamVu.profile.repository;

import com.NamVu.profile.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProfileRepository extends Neo4jRepository<Profile, String> {
    Optional<Profile> findByUserIdAndIsActive(String userId, Integer isActive);

    Page<Profile> findByIsActive(Integer isActive, Pageable pageable);

    List<Profile> findByUserIdInAndIsActive(Set<String> userIds, Integer isActive);

    @Query("""
            MATCH (p:Profile {userId: $userId})-[r:FRIEND]->(friend:Profile)
            WHERE $lastUserId IS NULL OR friend.userId > $lastUserId
            RETURN friend
            ORDER BY friend.userId ASC
            LIMIT $limit
            """)
    List<Profile> getAllFriendsAfterLastUserId(String userId, String lastUserId, int limit);

    @Query("""
            MATCH (p:Profile {userId: $userId})-[r:FRIEND]->(friend:Profile)
            RETURN friend.userId
            """)
    List<String> getAllFriendIds(String userId);

    @Query("""
            MATCH (me:Profile {userId: $userId})
            MATCH (p:Profile)
            WHERE p.userId <> me.userId
              AND NOT (me)-[:FRIEND]->(p)
              AND NOT (me)-[:FRIEND_REQUEST]->(p)
              AND NOT (p)-[:FRIEND_REQUEST]->(me)
              AND ($lastUserId IS NULL OR p.userId > $lastUserId)
            RETURN p
            ORDER BY p.userId ASC
            LIMIT $limit
            """)
    List<Profile> getFriendSuggestionsAfterLastUserId(String userId, String lastUserId, int limit);

    @Query("""
            MATCH (a:Profile)-[r:FRIEND]-(b:Profile)
            WHERE a.userId = $senderId AND b.userId = $receiverId
            DELETE r
            RETURN COUNT(r) > 0
            """)
    boolean removeFriendRelationship(String senderId, String receiverId);

    @Query("""
            MATCH (a:Profile {userId: $senderId}), (b:Profile {userId: $receiverId})
            MERGE (a)-[:FRIEND]->(b)
            MERGE (b)-[:FRIEND]->(a)
            """)
    void createFriendship(String senderId, String receiverId);

    @Query("""
            MATCH (:Profile {userId: $receiverId})<-[r:FRIEND_REQUEST]-(sender:Profile {userId: $senderId})
            DELETE r
            """)
    void deleteFriendRequest(String senderId, String receiverId);
}

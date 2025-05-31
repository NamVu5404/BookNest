package com.NamVu.profile.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import com.NamVu.profile.constant.RelationshipConstant;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node
public class Profile {
    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;

    String userId;
    String fullName;
    String phoneNumber;
    LocalDate dob;
    String avatar;
    String bio;

    @Builder.Default
    Integer isActive = 1;

    @Builder.Default
    @Relationship(type = RelationshipConstant.FRIEND_REQUEST, direction = Relationship.Direction.OUTGOING)
    Set<FriendRequest> sentRequests = new HashSet<>();

    @Builder.Default
    @Relationship(type = RelationshipConstant.FRIEND_REQUEST, direction = Relationship.Direction.INCOMING)
    Set<FriendRequest> receivedRequests = new HashSet<>();

    @Builder.Default
    @Relationship(type = RelationshipConstant.FRIEND, direction = Relationship.Direction.OUTGOING)
    Set<Profile> friends = new HashSet<>();
}

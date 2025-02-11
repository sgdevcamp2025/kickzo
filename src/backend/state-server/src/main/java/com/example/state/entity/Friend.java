package com.example.state.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "friend")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(FriendId.class)
public class Friend {

    @Id
    @Column(name = "friend_1")
    private Long friend1;

    @Id
    @Column(name = "friend_2")
    private Long friend2;

    @Column(name = "created_at", nullable = false, updatable = false)
    private String createdAt;
}

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
    // TODO[SMG-Q]: 1,2 구분이 뭔지랑, Friend 엔티티랑 뭔 차이인가요?
    // TODO[SMG-C]: 변수명 변경
    // friend1, 2가 아니라 조금 더 역할에 맞는 이름으로 지어주시면 좋을거 같아요. 추가로 설명도 같이 있으면 좋을거 같아요

    @Id
    @Column(name = "friend_1")
    private Long friend1;

    @Id
    @Column(name = "friend_2")
    private Long friend2;

    @Column(name = "created_at", nullable = false, updatable = false)
    private String createdAt;
}

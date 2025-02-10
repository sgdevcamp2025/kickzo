package com.example.state.entity;

import java.io.Serializable;
import java.util.Objects;

public class FriendId implements Serializable {
    private Long friend1;
    private Long friend2;

    public FriendId() {}

    public FriendId(Long friend1, Long friend2) {
        this.friend1 = friend1;
        this.friend2 = friend2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendId friendId = (FriendId) o;
        return Objects.equals(friend1, friendId.friend1) &&
                Objects.equals(friend2, friendId.friend2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(friend1, friend2);
    }
}

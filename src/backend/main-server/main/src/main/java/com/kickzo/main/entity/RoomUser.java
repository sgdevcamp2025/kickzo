package com.kickzo.main.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "room_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomUser {

	@EmbeddedId
	private RoomUserId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id", insertable = false, updatable = false) // 외래 키 매핑
	private Room room;

	@Column(name = "role", nullable = false)
	private int role;

	@Column(name = "joined_at", nullable = false)
	private LocalDateTime joinedAt;
	//private LocalDateTime joinedAt = LocalDateTime.now();
}

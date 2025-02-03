package com.kickzo.main.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "room")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "title", nullable = false, length = 60)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "category", length = 20)
	private String category;

	@Column(name = "is_public", nullable = false)
	private Boolean isPublic;

	@Column(name = "code", nullable = false, length = 8, unique = true)
	private String code;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "user_count", nullable = false)
	private int userCount;

	@Column(name = "creator", nullable = false, length = 20)
	private String creator;

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
	private List<RoomUser> roomUsers = new ArrayList<>();

	@OneToOne(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private Playlist playlist;

	// 사용자 수 증가 메서드
	public void incrementUserCount() {
		this.userCount++;
	}

	// 사용자 수 감소 메서드
	public void decrementUserCount() {
		if (this.userCount > 0) {
			this.userCount--;
		}
	}
}

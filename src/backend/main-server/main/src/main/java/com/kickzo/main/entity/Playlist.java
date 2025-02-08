package com.kickzo.main.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "playlist")
public class Playlist {

	@Id
	@Column(name = "room_id")
	private Long roomId;

	@Column(name = "`order`", columnDefinition = "JSON")
	private String order;

	@OneToOne
	@JoinColumn(name = "room_id", insertable = false, updatable = false)
	private Room room;
}
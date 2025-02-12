package com.kickzo.main.entity;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kickzo.main.dto.data.PlaylistItem;
import com.kickzo.main.exception.CustomErrorCode;
import com.kickzo.main.exception.CustomException;

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

	// JSON 문자열 -> List<PlaylistItem> 변환
	public List<PlaylistItem> getOrderAsList() {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.readValue(order, new TypeReference<>() {});
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}

	// List<PlaylistItem> -> JSON 문자열 변환
	public void setOrderFromList(List<PlaylistItem> playlistItems) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			this.order = objectMapper.writeValueAsString(playlistItems);
		} catch (JsonProcessingException e) {
			throw new CustomException(CustomErrorCode.JSON_PROCESSING_ERROR);
		}
	}
}
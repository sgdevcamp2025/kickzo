package com.kickzo.main;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(indexName = "rooms") // Elasticsearch 인덱스 이름
public class RoomDocument {
	@Id
	private Long id;

	@Field(type = FieldType.Text)
	private String title;

	@Field(type = FieldType.Boolean)
	private Boolean isPublic;

	@Field(type = FieldType.Integer)
	private int userCount;

	@Field(type = FieldType.Keyword)
	private String creator;
}

package com.kickzo.main.search.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(indexName = "room")
public class RoomDocument {
	@Id
	private Long roomId;

	@Field(type = FieldType.Text)
	private String title;

	@Field(type = FieldType.Boolean)
	private boolean isPublic;
}

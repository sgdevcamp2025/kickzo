package com.kickzo.main.search.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Document(indexName = "search")
@AllArgsConstructor
@NoArgsConstructor
public class UserDocument {
	@Id
	private Long userId;

	@Field(type = FieldType.Text)
	private String nickname;

	@Field(type = FieldType.Text)
	private String stateMessage;

	@Field(type = FieldType.Text)
	private String profileImageUrl;
}

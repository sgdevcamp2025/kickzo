package com.example.state.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatusUpdateDto {
    private Long userId; // userId를 Long으로 변경
    private String status;
    private List<Long> friends; // friends 리스트 안의 값도 Long으로 변경
    private Long timestamp; // timestamp를 Long으로 변경
}

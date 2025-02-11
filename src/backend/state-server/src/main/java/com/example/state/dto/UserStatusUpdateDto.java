package com.example.state.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatusUpdateDto {
    private String userId;
    private String status;
    private List<String> friends;
    private String timestamp;
}

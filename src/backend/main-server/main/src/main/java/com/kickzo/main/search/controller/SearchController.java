package com.kickzo.main.search.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.kickzo.main.search.service.SearchService;

@Slf4j
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
	private final SearchService searchService;

	@GetMapping
	public Map<String, Object> searchRoomsAndUsers(@RequestParam String keyword) {
		Map<String, Object> result = new HashMap<>();
		result.put("rooms", searchService.searchRooms(keyword));
		result.put("users", searchService.searchUsers(keyword));
		return result;
	}
}

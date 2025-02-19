package com.kickzo.main;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class RoomSearchController {

	private final RoomSearchRepository roomSearchRepository;

	@GetMapping()
	public List<RoomDocument> searchRooms(@RequestParam String keyword) {
		return roomSearchRepository.findByTitleContainingOrCreatorContaining(keyword, keyword);
	}
}

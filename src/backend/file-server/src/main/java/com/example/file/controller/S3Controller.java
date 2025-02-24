package com.example.file.controller;

import com.example.file.service.S3Service;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.time.Instant;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")  // 모든 출처에서의 요청을 허용
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    // 파일 업로드를 위한 presigned URL 생성
    @GetMapping("/upload/{fileName}")
    public String generatePresignedUrl(@PathVariable String fileName,
                                       @RequestParam String contentType) {
        // Add 'images/' prefix to the file name
        String uniqueFileName = "images/" + Instant.now().toEpochMilli() + "_" + fileName;
        URL presignedUrl = s3Service.generatePresignedUrl(uniqueFileName, contentType);
        return presignedUrl.toString();
    }
}

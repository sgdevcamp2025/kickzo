package com.example.file.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(@Value("${aws.accessKey}") String accessKeyId,
                     @Value("${aws.secretAccessKey}") String secretAccessKey,
                     @Value("${aws.region}") String region) {
        this.presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                ))
                .build();
    }

    // 파일 업로드를 위한 presigned URL 생성
    public URL generatePresignedUrl(String filePath, String contentType) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath)  // The key now includes the 'images/' folder
                .contentType(contentType)  // 파일의 MIME 타입을 설정
                .build();

        // URL의 유효 기간을 설정 (예시: 10분)
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        // Presigned URL 생성
        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);

        return presignedRequest.url();  // 생성된 URL 반환
    }
}

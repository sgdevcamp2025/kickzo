# 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim

# 애플리케이션 파일을 컨테이너에 복사
ARG JAR_FILE=kickzo-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]
# 1️⃣ 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim AS build

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ 프로젝트 복사
COPY . .

# 4️⃣ Gradle 빌드 수행 (테스트는 제외)
RUN chmod +x gradlew
RUN ./gradlew build -x test

# 5️⃣ 런타임 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim
WORKDIR /app

# 6️⃣ 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 7️⃣ 컨테이너 실행 시 Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
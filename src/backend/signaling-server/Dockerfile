# 1️⃣ Java 21 LTS 기반 이미지 사용
FROM eclipse-temurin:21-jdk AS build

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ 프로젝트 복사
COPY . .

# 4️⃣ Gradle 빌드 수행
RUN ./gradlew build -x test

# 5️⃣ 실행을 위한 Java 21 런타임 이미지
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# 6️⃣ 빌드된 JAR 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 7️⃣ 컨테이너 실행 시 Spring Boot 애플리케이션 실행
CMD ["java", "-jar", "app.jar"]

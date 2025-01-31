CREATE DATABASE IF NOT EXISTS kickzo;

USE kickzo;

-- user 테이블
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 유저 고유 ID
    email VARCHAR(254) NOT NULL UNIQUE,     -- 이메일
    nickname VARCHAR(20) NOT NULL UNIQUE,   -- 별명
    role INT NOT NULL DEFAULT 0,                      
    profile_image_url VARCHAR(2048),        -- 대표 프로필 이미지 url
    profile_images JSON,                    -- 프로필 이미지 배열
    nickname_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 최근 별명 업데이트 시간 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             -- 유저 생성 시각
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    -- 마지막 접근 시각
    deleted_at DATETIME NULL DEFAULT NULL,  -- 탈퇴 시간(soft delete)
    salt CHAR(64),                          -- 쏠트값
    password CHAR(64) NOT NULL,             -- user의 해싱된 비밀번호
    password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 비밀번호 변경 시각
    state_message VARCHAR(100)              -- 프로필 상태 메세지
    );

-- room 테이블
CREATE TABLE IF NOT EXISTS room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 방 고유 ID
    title VARCHAR(60) NOT NULL,             -- 방 제목
    description TEXT,                       -- 방 설명
    category VARCHAR(20),                   -- 방 카테고리
    is_public BOOLEAN DEFAULT TRUE,         -- 방 공개여부
    code CHAR(8) NOT NULL,                  -- 방 코드
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 방 생성 시간
    user_count INT DEFAULT 0,               -- 사용자 수
    creator VARCHAR(20) NOT NULL,            -- 방 생성자 닉네임

    FOREIGN KEY (creator) REFERENCES user(nickname) ON UPDATE CASCADE ON DELETE CASCADE
);

-- room user 테이블
CREATE TABLE IF NOT EXISTS room_user(
    room_id BIGINT NOT NULL,                -- 방 ID (room 테이블의 id와 연결)
    user_id BIGINT NOT NULL,                -- 유저 ID (users 테이블의 id와 연결)
    role INT NOT NULL,                      -- 유저의 역할 (creator:0, moderator:1, viewer:2)
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 유저가 방에 입장한 시간
    
    PRIMARY KEY (room_id, user_id),         -- room_id와 user_id를 조합하여 기본 키 설정 
    
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE,  -- room 테이블의 id를 참조, 방 삭제 시 해당 유저 정보도 삭제
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE  -- users 테이블의 id를 참조, 유저 삭제 시 해당 유저의 방 정보도 삭제
);

-- friend 테이블
CREATE TABLE IF NOT EXISTS friend (
    friend_1 BIGINT NOT NULL,
    friend_2 BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (friend_1, friend_2),  -- friend_1과 friend_2의 조합을 기본 키로 설정
    CONSTRAINT fk_friend_1 FOREIGN KEY (friend_1) REFERENCES user(id) ON DELETE CASCADE,  -- friend_1은 users 테이블의 id를 참조
    CONSTRAINT fk_friend_2 FOREIGN KEY (friend_2) REFERENCES user(id) ON DELETE CASCADE  -- friend_2는 users 테이블의 id를 참조
);



-- playlist 테이블
CREATE TABLE IF NOT EXISTS playlist (
    room_id BIGINT NOT NULL, 
    `order` JSON,  -- 예약어인 'order'를 컬럼명으로 사용하기 위해 (``)으로 감쌈
    PRIMARY KEY (room_id),
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE
);


-- user 테이블 예시
INSERT INTO user (email, nickname, password) VALUES
('user1@example.com', 'User1', 'password1'),
('user2@example.com', 'User2', 'password2'),
('user3@example.com', 'User3', 'password3');

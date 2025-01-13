# Makefile for Docker Compose

# Docker Compose 파일 경로
DOCKER_COMPOSE_FILE = ./infra/docker-compose.yml
PROFILES = --profile mock \

# 전체 프로파일 목록
SERVICE ?= chat-service # 기본 컨테이너 이름

# 기본 대상
.PHONY: all up down re mock logs build ps clean fclean help

all: ## 전체 컨테이너 실행
	docker-compose -f $(DOCKER_COMPOSE_FILE) $(PROFILES) up -d

up: ## 컨테이너를 백그라운드에서 실행
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

down: ## 모든 컨테이너 중지 및 네트워크 제거
	docker-compose -f $(DOCKER_COMPOSE_FILE) $(PROFILES) down

re: ## 컨테이너를 재시작
	docker-compose -f $(DOCKER_COMPOSE_FILE) down
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

mock: ## JSON 목킹 서버 실행
	docker-compose -f $(DOCKER_COMPOSE_FILE) $(PROFILES) up -d

logs: ## 컨테이너 로그 표시
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

build: ## 이미지를 다시 빌드
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

ps: ## 실행 중인 컨테이너 목록 확인
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

exec: ## 특정 컨테이너 내부에 bash로 접속 (예시: make exec SERVICE=chat-service)
	@echo "Connecting to container: $(SERVICE)"
	docker exec -it $(SERVICE) bash

clean: ## 모든 컨테이너, 네트워크 및 볼륨 제거
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans

fclean: ## 캐싱된 이미지, 볼륨, 네트워크 모두 제거
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans
	docker image prune -af
	docker volume prune -f
	docker network prune -f

help: ## 사용 가능한 명령어 표시
	@echo "사용 가능한 명령어:"
	@echo "  make all       - 전체 컨테이너 실행"
	@echo "  make up        - 컨테이너를 백그라운드에서 실행"
	@echo "  make down      - 모든 컨테이너 중지 및 네트워크 제거"
	@echo "  make re        - 컨테이너를 재시작"
	@echo "  make mock      - 모킹 서버 실행"
	@echo "  make logs      - 컨테이너 로그 표시"
	@echo "  make build     - 이미지를 다시 빌드"
	@echo "  make exec      - 특정 컨테이너 내부에 bash로 접속"
	@echo "  make ps        - 실행 중인 컨테이너 목록 확인"
	@echo "  make clean     - 모든 컨테이너, 네트워크 및 볼륨 제거"
	@echo "  make fclean    - 캐싱된 이미지, 볼륨, 네트워크 모두 제거"
	@echo "  make help      - 사용 가능한 명령어 표시"

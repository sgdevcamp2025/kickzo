#!/bin/bash

# 모든 컨테이너 중지 및 삭제
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# 모든 이미지 삭제
docker rmi $(docker images -aq)

# 모든 네트워크 삭제
docker network prune -f

# 모든 볼륨 삭제
docker volume prune -f

# Docker 빌드 캐시 삭제
docker builder prune -a -f

echo "Docker cleanup completed!"

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiomysql
import aioredis
import json
from datetime import datetime
from aiokafka import AIOKafkaProducer
from datetime import datetime

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kafka 설정
KAFKA_TOPIC = "invitation"
KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"

# Kafka 프로듀서 초기화
async def get_kafka_producer():
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)
    await producer.start()
    return producer

# MySQL 및 Redis 설정
async def get_db():
    conn = await aiomysql.connect(host='mysql', user='root', password='test123', db='kickzo', port=3306)
    return conn

async def get_redis():
    return await aioredis.from_url("redis://redis:6379", db=3, decode_responses=True)

async def get_user_state_redis():
    return await aioredis.from_url("redis://redis:6379", db=1, decode_responses=True)

# 요청 데이터 모델
class FriendRequestBody(BaseModel):
    senderId: int
    receiverId: int

class UserRequest(BaseModel):
    user_id: int

@app.get("/api/friends/unread/{userId}") # notifications/unread
async def get_friend_requests(userId: int, redis=Depends(get_redis)):
    # 친구 요청 키 조회
    friend_pattern = f"friend_request:*:{userId}"
    friend_keys = await redis.keys(friend_pattern)
    
    # 방 초대 요청 키 조회
    room_pattern = f"room_request:*:{userId}:*"
    room_keys = await redis.keys(room_pattern)

    unread_count = 0

    # Redis에서 친구 요청 데이터 조회
    for key in friend_keys:
        request_data = json.loads(await redis.get(key))
        if not request_data.get("isRead", False):
            unread_count += 1

    # Redis에서 방 초대 요청 데이터 조회
    for key in room_keys:
        request_data = json.loads(await redis.get(key))
        if not request_data.get("isRead", False):
            unread_count += 1

    return {"unread_count": unread_count}

@app.get("/api/friends/requests/{userId}") # notifications
async def get_friend_requests(userId: int, redis=Depends(get_redis)):
    # 친구 요청 키 조회
    friend_pattern = f"friend_request:*:{userId}"
    friend_keys = await redis.keys(friend_pattern)
    
    # 방 초대 요청 키 조회
    room_pattern = f"room_request:*:{userId}:*"
    room_keys = await redis.keys(room_pattern)

    all_requests = []
    
    # Redis에서 요청 데이터 조회
    for key in friend_keys:
        request_data = json.loads(await redis.get(key))
        request_data["isRead"] = True
        ttl = await redis.ttl(key)
        await redis.setex(key, ttl, json.dumps(request_data))
        all_requests.append(request_data)
    
    for key in room_keys:
        request_data = json.loads(await redis.get(key))
        request_data["isRead"] = True
        ttl = await redis.ttl(key)
        await redis.setex(key, ttl, json.dumps(request_data))
        all_requests.append(request_data)

    # timestamp 기준으로 정렬 (내림차순)
    all_requests.sort(key=lambda x: x["timestamp"], reverse=True)

    return {"requests": all_requests}

@app.post("/api/friends/request")
async def send_friend_request(
    data: FriendRequestBody, 
    db=Depends(get_db), 
    redis=Depends(get_redis),
    producer=Depends(get_kafka_producer)
):
    if data.senderId == data.receiverId:
        raise HTTPException(status_code=400, detail="자기 자신에게 친구 요청을 보낼 수 없습니다.")
    
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute(
            "SELECT * FROM friend WHERE (friend_1 = %s AND friend_2 = %s) OR (friend_1 = %s AND friend_2 = %s)",
            (data.senderId, data.receiverId, data.receiverId, data.senderId)
        )
        if await cursor.fetchone():
            raise HTTPException(status_code=400, detail="이미 친구입니다.")
        
        # sender와 receiver의 nickname 조회
        await cursor.execute("SELECT id, nickname FROM user WHERE id IN (%s, %s)", (data.senderId, data.receiverId))
        user_data = {row["id"]: row["nickname"] for row in await cursor.fetchall()}

        sender_nickname = user_data.get(data.senderId, "Unknown")
        receiver_nickname = user_data.get(data.receiverId, "Unknown")
    
    request_key = f"friend_request:{data.senderId}:{data.receiverId}"

    existing_request = await redis.get(request_key)
    if existing_request:
        existing_request = json.loads(existing_request)
        status = existing_request.get("status", "PENDING")

        if status == "PENDING":
            raise HTTPException(status_code=400, detail="이미 친구 요청을 보냈습니다.")
        elif status == "REJECTED":
            ttl = await redis.ttl(request_key)
            raise HTTPException(
                status_code=400, 
                detail=f"남은 TTL({ttl}초) 이후에 친구 요청을 보낼 수 있습니다."
            )
    
    request_data = {
        "type": "friend_request",
        "senderId": data.senderId,
        "senderNickname": sender_nickname,
        "receiverId": data.receiverId,
        "receiverNickname": receiver_nickname,
        "timestamp": int(datetime.utcnow().timestamp() * 1000),
        "isRead": False,
        "status": "PENDING",
        "roomId": "null",
        "roomCode": "null"
    }

    # Redis에 저장
    await redis.set(request_key, json.dumps(request_data), ex=604800)

    # Kafka에 메시지 전송
    await producer.send_and_wait(KAFKA_TOPIC, json.dumps(request_data).encode("utf-8"))
    return {"message": "친구 요청을 보냈습니다."}

@app.post("/api/friends/accept")
async def accept_friend_request(data: FriendRequestBody, db=Depends(get_db), redis=Depends(get_redis)):
    request_key = f"friend_request:{data.senderId}:{data.receiverId}"
    
    # Redis에서 친구 요청 데이터 가져오기
    existing_request = await redis.get(request_key)
    if not existing_request:
        raise HTTPException(status_code=400, detail="친구 요청이 없습니다.")

    request_data = json.loads(existing_request)
    
    # status가 PENDING이 아닌 경우 예외 처리 (이미 수락 또는 거절된 요청)
    if request_data.get("status") != "PENDING":
        raise HTTPException(status_code=400, detail="이미 처리된 친구 요청입니다.")

    # DB에 친구 관계 추가
    async with db.cursor() as cursor:
        await cursor.execute(
            "INSERT INTO friend (friend_1, friend_2, created_at) VALUES (%s, %s, %s)",
            (min(data.senderId, data.receiverId), max(data.senderId, data.receiverId), datetime.utcnow())
        )
        await db.commit()
    
    # status를 "accepted"로 변경
    request_data["status"] = "ACCEPTED"
    
    # TTL 유지하면서 Redis 업데이트
    ttl = await redis.ttl(request_key)
    await redis.setex(request_key, ttl, json.dumps(request_data))

    return {"message": "친구 요청을 수락했습니다."}

@app.delete("/api/friends/reject")
async def reject_friend_request(data: FriendRequestBody, redis=Depends(get_redis)):
    request_key = f"friend_request:{data.senderId}:{data.receiverId}"
    
    # Redis에서 친구 요청 데이터 가져오기
    existing_request = await redis.get(request_key)
    if not existing_request:
        raise HTTPException(status_code=400, detail="친구 요청이 없습니다.")

    request_data = json.loads(existing_request)
    
    # status가 이미 "REJECTED"인 경우 예외 처리
    if request_data.get("status") == "REJECTED":
        raise HTTPException(status_code=400, detail="이미 거절된 친구 요청입니다.")

    # status를 "REJECTED"로 변경 & isRead = True
    request_data["status"] = "REJECTED"

    # TTL 유지하면서 Redis 업데이트
    ttl = await redis.ttl(request_key)
    await redis.setex(request_key, ttl, json.dumps(request_data))

    return {"message": "친구 요청을 거절했습니다."}

@app.get("/api/friends/list/{userId}") # friends/me
async def get_friend_list(userId: int, db=Depends(get_db), redis=Depends(get_user_state_redis)):
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute("SELECT * FROM friend WHERE friend_1 = %s OR friend_2 = %s", (userId, userId))
        friends = await cursor.fetchall()
    
    friend_list = []
    for friend in friends:
        friend_id = friend['friend_2'] if friend['friend_1'] == userId else friend['friend_1']
        
        # Redis에서 친구의 온라인 상태 조회
        state_key = f"user:state:{friend_id}"
        state_data = await redis.hgetall(state_key)
        if state_data:
            state_info = state_data
        else:
            state_info = {"status": "offline", "serverPort": None, "timestamp": None}
        
        friend_list.append({
            "friend_id": friend_id,
            "status": state_info.get("status"),
            "serverPort": state_info.get("serverPort"),
            "timestamp": state_info.get("timestamp")
        })
    
    return {"friends": friend_list}


@app.get("/user/list")
async def get_user_list(db=Depends(get_db)):
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute("SELECT id, nickname, email FROM user")
        users = await cursor.fetchall()
    return users
#!/bin/sh

echo "⏳ Waiting for Elasticsearch to be ready..."
until curl -s -u elastic:test123 "http://localhost:9200/_cluster/health" | grep -q '"status":"green"\|"status":"yellow"'; do
  sleep 5
done

echo "✅ Elasticsearch is ready. Creating and roles..."

# kickzo_role 생성
curl -X PUT "http://localhost:9200/_security/role/kickzo_role" \
-H "Content-Type: application/json" \
-u elastic:test123 \
-d '{
  "cluster": ["all"],
  "indices": [
    {
      "names": [".kibana*", ".kibana_task_manager*"],
      "privileges": ["auto_configure", "create_index", "manage", "all"],
      "allow_restricted_indices": true
    },
    {
      "names": [".fleet*", ".fleet-enrollment-api-keys"],
      "privileges": ["auto_configure", "create_index", "manage", "all"],
      "allow_restricted_indices": true
      }
  ]
}'

# kickzo 사용자 생성 또는 업데이트
curl -X PUT "http://localhost:9200/_security/user/kickzo" \
-H "Content-Type: application/json" \
-u elastic:test123 \
-d '{
  "password": "test123",
  "roles": ["superuser", "kickzo_role"]
}'

echo "✅ Elasticsearch user and roles setup completed."

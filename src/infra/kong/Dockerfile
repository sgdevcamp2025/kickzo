FROM kong:3.4

ENV KONG_DATABASE=off \
		KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml \
		KONG_PROXY_ACCESS_LOG=/dev/stdout \
		KONG_ADMIN_ACCESS_LOG=/dev/stdout \
		KONG_PROXY_ERROR_LOG=/dev/stderr \
		KONG_ADMIN_ERROR_LOG=/dev/stderr \
		KONG_ADMIN_LISTEN=0.0.0.0:8001 \
		KONG_ADMIN_GUI_URL=http://localhost:8002


COPY kong.yml /usr/local/kong/declarative/kong.yml

EXPOSE 8000 8443 8001 8444

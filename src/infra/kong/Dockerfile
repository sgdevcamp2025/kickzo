FROM kong:3.4

ENV KONG_DATABASE=off \
		KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml \
		KONG_PROXY_ACCESS_LOG=/dev/stdout \
		KONG_ADMIN_ACCESS_LOG=/dev/stdout \
		KONG_PROXY_ERROR_LOG=/dev/stderr \
		KONG_ADMIN_ERROR_LOG=/dev/stderr \
		KONG_ADMIN_LISTEN=0.0.0.0:8001 \
		KONG_ADMIN_GUI_URL=http://localhost:8002

USER root

COPY kong.yml /usr/local/kong/declarative/kong.yml
COPY plugins/custom-jwt-header /usr/local/share/lua/5.1/kong/plugins/custom-jwt-header

RUN chown -R kong:kong /usr/local/share/lua/5.1/kong/plugins/custom-jwt-header

ENV KONG_PLUGINS=bundled,custom-jwt-header

USER kong

EXPOSE 8000 8443 8001 8444

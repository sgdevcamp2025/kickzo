FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=test123
ENV MYSQL_DATABASE=kickzo
ENV MYSQL_USER=kickzo
ENV MYSQL_PASSWORD=test123

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

CMD ["mysqld"]

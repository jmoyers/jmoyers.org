FROM nginx:1.16.0-alpine
MAINTAINER jmoyers@gmail.com

RUN mkdir -p /usr/local/src/jmoyers_org/public
WORKDIR /usr/local/src/jmoyers_org/public
COPY public .
RUN find . -type d | xargs chmod u=rwx,g=rx,o=rx
RUN find . -type f | xargs chmod u=rw,g=r,o=r

COPY nginx.conf /etc/nginx/conf.d/default.conf

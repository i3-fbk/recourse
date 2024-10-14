FROM node:16.17.0-bullseye-slim as build-stage

#RUN echo "$REACT_APP_DEV_RECOURSE_ENDPOINT"
WORKDIR /app
COPY . .
RUN npm ci --only=production


ARG RECOURSE_ENDPOINT
ARG RECOURSE_LOG_ENDPOINT

ENV REACT_APP_RECOURSE_ENDPOINT=${RECOURSE_ENDPOINT}
ENV REACT_APP_DEV_RECOURSE_ENDPOINT=${RECOURSE_ENDPOINT}
ENV REACT_APP_RECOURSE_LOG_ENDPOINT=${RECOURSE_LOG_ENDPOINT}

RUN npm run build

# FROM nginx:alpine AS prod-stage
#FROM nginxinc/nginx-unprivileged AS prod-stage
FROM nginx:1.25.2-alpine-slim AS prod-stage

#COPY server.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/build /usr/share/nginx/html

ARG USER=webuser
ARG USER_ID=1030
ARG USER_GROUP=webuser
ARG USER_GROUP_ID=1030
ARG USER_HOME=/home/${USER}
RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
	adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;


## add permissions

RUN mkdir -p /var/cache/nginx && chown -R ${USER}:${GROUP} /var/cache/nginx && \
	mkdir -p /var/log/nginx  && chown -R ${USER}:${GROUP} /var/log/nginx && \
	mkdir -p /var/lib/nginx  && chown -R ${USER}:${GROUP} /var/lib/nginx && \
	touch /var/run/nginx.pid && chown -R ${USER}:${GROUP} /var/run/nginx.pid && \
	mkdir -p /etc/nginx/templates /etc/nginx/ssl/certs && \
	chown -R ${USER}:${GROUP} /etc/nginx && \
	chmod -R 777 /etc/nginx/conf.d

## switch to non-root user
USER ${USER}

EXPOSE 8080
# run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

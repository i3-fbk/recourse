FROM node:16.17.0-bullseye-slim as build-stage
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ARG USER=recourse-user
ARG USER_ID=1030
ARG USER_GROUP=recourse-user
ARG USER_GROUP_ID=1030
ARG USER_HOME=/home/${USER}
ENV VER=${VER}
RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
     adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;
USER ${USER}

EXPOSE 3004
CMD ["node", "build/entrypoint.js"]
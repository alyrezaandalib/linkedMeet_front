FROM node:lts-alpine
LABEL authors="Moein Bakhtnama"

ARG UID
ARG GID

ENV UID=${UID}
ENV GID=${GID}

RUN apk add shadow

RUN groupmod -g 1001 node \
    && usermod -u 1001 -g 1001 node

RUN delgroup dialout

RUN addgroup -g ${GID} --system linkedmeet
RUN adduser -G linkedmeet --system -D -s /bin/sh -u ${UID} linkedmeet

RUN mkdir -p /app
WORKDIR /app

USER linkedmeet

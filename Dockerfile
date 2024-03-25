# Adapted from https://bun.sh/guides/ecosystem/docker
# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.0.35-alpine as base
WORKDIR /usr/src/app

RUN apk add coreutils

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY apps/web/package.json /temp/dev/apps/web/
COPY packages/kotekan/package.json /temp/dev/packages/kotekan/
# TMP
COPY packages/react-server-dom-esm/package.json /temp/dev/packages/react-server-dom-esm/
# RUN cd /temp/dev && bun install --frozen-lockfile
RUN cd /temp/dev && bun install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
COPY apps/web/package.json /temp/prod/apps/web/
COPY packages/kotekan/package.json /temp/prod/packages/kotekan/
# TMP
COPY packages/react-server-dom-esm/package.json /temp/prod/packages/react-server-dom-esm/
# RUN cd /temp/prod && bun install --frozen-lockfile --production
RUN cd /temp/prod && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --chown=bun . .

# [optional] tests & build
ENV NODE_ENV=production
# RUN bun test

# copy production dependencies and source code into final image
FROM base AS release
# FROM oven/bun:1.0.35-distroless as release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .

# ARG BUILD_TIMESTAMP
# ENV DOCKER_BUILD_TIMESTAMP=${BUILD_TIMESTAMP}

ENV NODE_ENV=production

# run the app
WORKDIR /usr/src/app/apps/web
USER bun
EXPOSE 3000/tcp
# ENTRYPOINT [ "bun" ]

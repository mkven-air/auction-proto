# syntax=docker/dockerfile:1

# --- builder ------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

WORKDIR /app

# Install workspace deps first for better layer caching.
# All workspace package.json files are required so pnpm can validate the
# frozen lockfile; the --filter limits what actually gets linked to the
# server and its workspace dependencies (no web/vite/react in node_modules).
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/api-contracts/package.json ./packages/api-contracts/
COPY packages/backend/package.json ./packages/backend/
COPY packages/server/package.json ./packages/server/
COPY packages/web-shared/package.json ./packages/web-shared/
COPY packages/web-admin/package.json ./packages/web-admin/
COPY packages/web-passenger/package.json ./packages/web-passenger/

RUN pnpm install --frozen-lockfile --ignore-scripts --filter "@auction/server..."

# Copy sources (only what the server needs at runtime)
COPY packages/core ./packages/core
COPY packages/api-contracts ./packages/api-contracts
COPY packages/backend ./packages/backend
COPY packages/server ./packages/server
COPY tsconfig.base.json tsconfig.json ./

# --- runtime ------------------------------------------------------------------
FROM node:22-alpine

# Patch base image
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Strip bundled package managers that we don't use at runtime
RUN rm -rf \
    /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /opt/yarn-* \
    /usr/local/bin/yarn \
    /usr/local/bin/yarnpkg

# Non-root user
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Copy the built workspace from the builder
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder --chown=app:app /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=app:app /app/packages/core ./packages/core
COPY --from=builder --chown=app:app /app/packages/api-contracts ./packages/api-contracts
COPY --from=builder --chown=app:app /app/packages/backend ./packages/backend
COPY --from=builder --chown=app:app /app/packages/server ./packages/server

USER app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

ENV TSX_TSCONFIG_PATH=packages/server/tsconfig.json
CMD ["node", "packages/server/node_modules/tsx/dist/cli.mjs", "packages/server/src/main.ts"]

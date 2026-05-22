# Multi-stage Dockerfile for yomu-frontend (Next.js 16)
# Based on official Docker + Next.js best practices.
#
# Build: docker build --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') -t yomu-frontend .
# Run:   docker run -p 3000:3000 -e NEXT_PUBLIC_YOMU_API_BASE_URL=http://host:8081 -e NEXT_PUBLIC_RUST_ENGINE_BASE_URL=http://host:8080 yomu-frontend

ARG NODE_VERSION=24-slim
ARG NEXT_PUBLIC_YOMU_API_BASE_URL
ARG NEXT_PUBLIC_RUST_ENGINE_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci --no-audit --no-fund --ignore-scripts

# ============================================
# Stage 2: Builder
# ============================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

ARG NEXT_PUBLIC_YOMU_API_BASE_URL
ARG NEXT_PUBLIC_RUST_ENGINE_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Copy installed deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept branch-specific build args for public env vars (baked into Next.js bundle)
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ARG NEXT_PUBLIC_YOMU_API_BASE_URL
ENV NEXT_PUBLIC_YOMU_API_BASE_URL=${NEXT_PUBLIC_YOMU_API_BASE_URL}
ARG NEXT_PUBLIC_RUST_ENGINE_BASE_URL
ENV NEXT_PUBLIC_RUST_ENGINE_BASE_URL=${NEXT_PUBLIC_RUST_ENGINE_BASE_URL}
ARG NEXT_PUBLIC_RUST_ENGINE_URL
ENV NEXT_PUBLIC_RUST_ENGINE_URL=${NEXT_PUBLIC_RUST_ENGINE_URL}

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_YOMU_API_BASE_URL=${NEXT_PUBLIC_YOMU_API_BASE_URL}
ENV NEXT_PUBLIC_RUST_ENGINE_BASE_URL=${NEXT_PUBLIC_RUST_ENGINE_BASE_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

# Ensure TypeScript is available for next.config.ts transpilation
RUN npm install --no-save typescript

# Install native Linux bindings for Tailwind v4 (lightningcss, oxide)
RUN LIGHTNINGCSS_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/lightningcss'].version") && \
  OXIDE_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/@tailwindcss/oxide'].version") && \
  npm install --no-save \
  lightningcss-linux-x64-gnu@${LIGHTNINGCSS_VERSION} \
  @tailwindcss/oxide-linux-x64-gnu@${OXIDE_VERSION}

ENV NODE_ENV=production

RUN --mount=type=cache,target=/app/.next/cache \
  npm run build

# ============================================
# Stage 3: Runner (production)
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ARG NEXT_PUBLIC_YOMU_API_BASE_URL
ARG NEXT_PUBLIC_RUST_ENGINE_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_YOMU_API_BASE_URL=${NEXT_PUBLIC_YOMU_API_BASE_URL}
ENV NEXT_PUBLIC_RUST_ENGINE_BASE_URL=${NEXT_PUBLIC_RUST_ENGINE_BASE_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure prerender cache directory is writable
RUN mkdir -p .next && chown nextjs:nodejs .next

# OCI Labels
ARG IMAGE_SOURCE="https://github.com/advprog-2026-A14-project/yomu-frontend"
ARG IMAGE_DESCRIPTION="Yomu Frontend - Next.js 16 Polyglot Learning Platform"
ARG IMAGE_LICENSES="MIT"

LABEL org.opencontainers.image.source="${IMAGE_SOURCE}"
LABEL org.opencontainers.image.description="${IMAGE_DESCRIPTION}"
LABEL org.opencontainers.image.licenses="${IMAGE_LICENSES}"

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "http.get('http://localhost:3000', r => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))" || exit 1

CMD ["node", "server.js"]

# ── Dev target: Vite local development with HMR ──
FROM node:20-alpine AS dev

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]

# ── Builder stage: Compiles production static bundle ──
FROM dev AS builder
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# ── Prod & QA target: Served via lightweight Nginx ──
FROM nginx:1.25-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

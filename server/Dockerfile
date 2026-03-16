# ── Stage 1: builder ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Include all dependencies for building
RUN npm ci

# ── Stage 2: production ───────────────────────────────────
FROM node:20-alpine
RUN addgroup -S app && adduser -S -G app app
WORKDIR /app
# Only copy production node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN chown -R app:app /app
USER app
EXPOSE 5000
HEALTHCHECK CMD wget -qO- http://localhost:5000/api/health || exit 1
CMD ["node", "index.js"]

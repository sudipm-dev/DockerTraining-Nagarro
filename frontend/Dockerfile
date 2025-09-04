# Multi-stage

# Stage 1: Installing dependencies 
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile --prod


# Stage 2: Building source code
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Stage 3: Production image
FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure proper permissions for appuser
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]

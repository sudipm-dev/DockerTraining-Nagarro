# ---------- Stage 1: Builder ----------
    FROM node:14-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy only package files first (better caching)
    COPY package.json yarn.lock ./
    
    # Install all dependencies (dev + prod for build)
    RUN yarn install --production=false
    
    # Copy the rest of the source code
    COPY . .
    
    # ---------- Stage 2: Runtime ----------
    FROM node:14-alpine AS runtime
    
    # Set working directory
    WORKDIR /app
    
    # Create non-root user and group
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    
    # Copy only production files from builder
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/index.js ./index.js
    # If you have dist/ or public/, uncomment:
    # COPY --from=builder /app/dist ./dist
    # COPY --from=builder /app/public ./public
    
    # Set ownership and restrict permissions
    RUN chown -R appuser:appgroup /app \
        && chmod 644 /app/package.json \
        && chmod 644 /app/index.js \
        && chmod -R 755 /app/node_modules \
        && chmod -R 755 /app/dist || true \
        && chmod -R 755 /app/public || true
    
    # Switch to non-root user
    USER appuser
    
    # Expose port (if needed for clarity)
    EXPOSE 3000
    
    # Start the server
    CMD ["node", "index.js"]
    
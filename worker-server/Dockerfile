# ---------- Builder Stage ----------
    FROM node:14-alpine AS builder

    # set working directory
    WORKDIR /app
    
    # copy only package files first (better caching for dependencies)
    COPY package.json yarn.lock ./
    
    # install all dependencies (including dev, in case you need build tools)
    RUN yarn install
    
    # copy rest of the app files
    COPY . .
    
    
    # ---------- Runtime Stage ----------
    FROM node:14-alpine AS runtime
    
    WORKDIR /app
    
    # Create a non-root user and group
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    
    # copy only production dependencies from builder
    COPY --from=builder /app/node_modules ./node_modules
    
    # copy application files (only what’s required for running)
    COPY --from=builder /app/index.js ./index.js
    COPY --from=builder /app/package.json ./package.json
    # copy other runtime files if needed
    # COPY --from=builder /app/dist ./dist
    # COPY --from=builder /app/public ./public
    
    # Ensure appuser owns the working directory
    RUN chown -R appuser:appgroup /app
    
    # Switch to the non-root user
    USER appuser
    
    # start the server
    CMD ["node", "index.js"]
    
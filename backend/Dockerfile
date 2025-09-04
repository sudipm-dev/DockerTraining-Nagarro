# ---------- Builder Stage ----------
    FROM node:14-alpine AS builder

    # set working directory
    WORKDIR /app
    
    # copy only package files and install dependencies
    COPY package.json yarn.lock ./
    RUN yarn install --production=false
    
    # copy rest of the source code
    COPY . .
    
    
    # ---------- Runtime Stage ----------
    FROM node:14-alpine AS runtime
    
    # set working directory
    WORKDIR /app
    
    # Create a non-root user and group
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    
    # copy only production dependencies from builder
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/index.js ./index.js
    # (copy other necessary files like dist/, public/ etc.)
    # COPY --from=builder /app/dist ./dist
    
    # Change ownership of /app so appuser can access it
    RUN chown -R appuser:appgroup /app
    
    # Switch to non-root user
    USER appuser
    
    # start the server
    CMD ["node", "index.js"]
    
# Multi-stage Dockerfile for Pathfinder AI
# Optimized for production deployment with security and performance

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S pathfinder -u 1001

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=pathfinder:nodejs /app/dist ./dist
COPY --from=builder --chown=pathfinder:nodejs /app/public ./public

# Copy additional configuration files
COPY --chown=pathfinder:nodejs docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=pathfinder:nodejs docker/entrypoint.sh ./entrypoint.sh

# Install nginx for serving static files
RUN apk add --no-cache nginx && \
    mkdir -p /var/log/nginx && \
    mkdir -p /var/cache/nginx && \
    chown -R pathfinder:nodejs /var/log/nginx && \
    chown -R pathfinder:nodejs /var/cache/nginx && \
    chown -R pathfinder:nodejs /etc/nginx

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER pathfinder

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# Default command
CMD ["nginx", "-g", "daemon off;"]

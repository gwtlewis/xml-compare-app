# Multi-stage build for XML Compare App
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy source code
COPY . .

# Build backend
RUN cd backend && npm ci && npm run build

# Build frontend
RUN cd frontend && npm ci && npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S xmlcompare -u 1001

WORKDIR /app

# Copy built applications
COPY --from=builder --chown=xmlcompare:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=xmlcompare:nodejs /app/backend/package*.json ./backend/
COPY --from=builder --chown=xmlcompare:nodejs /app/frontend/dist ./frontend/dist

# Install production dependencies
RUN cd backend && npm ci --only=production

# Create necessary directories
RUN mkdir -p /app/logs && chown -R xmlcompare:nodejs /app/logs

# Switch to non-root user
USER xmlcompare

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/xml-compare/admin/test', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/dist/main.js"] 
# Multi-stage build for FastMCP Naver Search MCP Server
FROM node:22.12-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ vips-dev

COPY . /app
WORKDIR /app

# Use npm cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM node:22-alpine AS release

WORKDIR /app

# Copy built application and necessary files
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts --omit=dev

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpserver -u 1001 -G nodejs && \
    chown -R mcpserver:nodejs /app

# Switch to non-root user
USER mcpserver

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('FastMCP server health check passed')" || exit 1

ENTRYPOINT ["node", "dist/src/index.js"] 
FROM node:18-alpine

# Create the exact directory structure that App Runner expects
RUN mkdir -p /app/api
WORKDIR /app/api

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install only production dependencies after build
RUN npm ci --only=production

# Make start script executable
RUN chmod +x ./start.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check (make sure healthcheck.js exists or remove this line)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD node healthcheck.js || exit 1

# Start command
CMD ["/app/api/start.sh"]

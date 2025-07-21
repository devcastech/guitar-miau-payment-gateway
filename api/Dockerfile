# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache \
    bash \
    curl \
    postgresql-client \
    iputils \
    net-tools \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/start.sh ./

# Create necessary directories
RUN mkdir -p dist/seeds

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Make start script executable
RUN chmod +x ./start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application
# Start the application using the start script
#
CMD ["./start.sh"]

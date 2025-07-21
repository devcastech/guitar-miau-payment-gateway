FROM node:18-alpine

# Create directory structure expected by App Runner
RUN mkdir -p /app/api
WORKDIR /app/api

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production

# Make start script executable
RUN chmod +x ./start.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["./start.sh"]

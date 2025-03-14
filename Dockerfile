# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy over the necessary files from the build stage
ENV NODE_ENV=production

COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on (adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

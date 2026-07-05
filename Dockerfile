FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverage caching)
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN npm install

# Copy source code
COPY . .

# Build shared package
RUN npm run build -w @ticket/shared

# Setup database (prisma generate happens here)
# Note: we use db:migrate instead of setup to avoid recreating seed data every build,
# but since this is a local dev container, db:setup is fine.
RUN npm run db:setup

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start the application in dev mode for easy testing
CMD ["npm", "run", "dev"]

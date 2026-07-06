FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverage caching)
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/ packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/api/prisma/ apps/api/prisma/
COPY apps/web/package.json apps/web/

RUN npm install

# Copy source code
COPY . .

# Build shared package (done at runtime to avoid volume mount overwrite)

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start the application in dev mode for easy testing
CMD npm run build -w @ticket/shared && npm run db:setup && npm run dev

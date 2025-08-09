# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time API URL (overridden via --build-arg)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine
# SPA routing & caching
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Static build output from Vite
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

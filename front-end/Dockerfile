# Stage 1: Build Angular application
FROM node:22.10 AS build
ARG ENV

WORKDIR /app

COPY package.json ./
# Copy package-lock.json if it exists
RUN if [ -f package-lock.json ]; then cp package-lock.json .; fi

RUN npm install
COPY . .
RUN npm run build -- --configuration=${ENV} --project=san11-platform

# Stage 2: Serve with Caddy
FROM caddy:2.6.4-alpine
ARG CADDYFILE

COPY --from=build /app/dist/san11-platform/browser /srv

COPY ${CADDYFILE} /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

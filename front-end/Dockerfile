# Stage 1: Build Angular application
FROM node:22.10 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production --project=san11-platform

# Stage 2: Serve with Caddy
FROM caddy:2.6.4-alpine
COPY --from=build /app/dist/san11-platform /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
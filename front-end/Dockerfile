# FILE: front-end/Dockerfile
# Stage 1: Build the Angular app
FROM node:18.14 AS build
WORKDIR /app
COPY . .
RUN npm install
# RUN npm install -g @angular/cli
RUN npm run build --prod

# Stage 2: Serve the app with nginx
FROM nginx:alpine
COPY --from=build /app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

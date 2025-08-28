# Use node to build React app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve static files with nginx
FROM nginx:alpine

# Copy built files to nginx default web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (support SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

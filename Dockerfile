# Stage 1: Build the Vite project
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

RUN yarn install

# Build the project
RUN yarn build:nologin

# Stage 2: Serve the built files using Nginx
FROM registry.cn-hangzhou.aliyuncs.com/ohmygd/nginx:latest

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

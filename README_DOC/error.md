This is my github action workflow, and  file: ./Dockerfile.frontend

name: Push to Docker Hub

on:
  push:
    # branches: [ "main" ]
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  call_time:
    uses: ./.github/workflows/shared_time_utility.yml  

  build_and_push_to_docker_image:
    needs: call_time
    name: Push Docker image to Docker Hub
    env:
        GLOBAL_TOME: ${{ needs.call_time.outputs.formatted_time }}
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v6

      - name: Use Shared Time
        run: |
          echo "The time passed from the utility is: $GLOBAL_TOME"

      - name: Log in to Docker Hub 
        uses: docker/login-action@v4
        with: 
          username: ${{secrets.DOCKER_USERNAME}}
          password: ${{secrets.DOCKER_PASSWORD}}
          
      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v6
        with:
          images: ${{secrets.DOCKER_USERNAME}}/nginx_web_app_img

      - name: print ${{steps.meta.outputs.tags}}
        run: echo "Build Docker- ${{toJSON(steps.meta)}}"

      - name: Build and push Docker image
        uses: docker/build-push-action@v7
        with:
          context: .
          file: ./Dockerfile.frontend
          push: true
        #   repository: ${{secrets.DOCKER_USERNAME}}/nginx_web_app_img
          tags: ${{steps.meta.outputs.tags}}
          labels: ${{steps.meta.outputs.labels}}      

This file Dockerfile.frontend:

# ==========================================
# STAGE 1: Build the Node.js application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Clean previous installations, install dependencies, and build
RUN rm -rf node_modules package-lock.json && \
    npm install

# Copy the rest of your application code
COPY . .

# Run the build command (creates the /app/dist directory)
RUN npm run build


# ==========================================
# STAGE 2: Serve the application with Nginx
# ==========================================
FROM ubuntu/nginx

EXPOSE 80 443
WORKDIR /app

# Copy the compiled assets from the builder stage
COPY --from=builder /app/dist /var/www/html

# Install debugging/networking tools
RUN apt-get update -y && \
    apt-get install -y vim iputils-ping && \
    rm -rf /var/lib/apt/lists/*

# Clean up default Nginx configuration
RUN rm -f /etc/nginx/sites-enabled/default

# Copy your custom Nginx configurations
COPY ./nginx/config/default /etc/nginx/sites-enabled/default
COPY ./nginx/config/nginx.conf /etc/nginx/


Dockerfile.frontend dependent .env file whene run and build to creates the /app/dist directory 

RUN npm run build:

VITE_BACKEND_API_URL=localhost

VITE_KC_API_URL=localhost

VITE_KC_PORT=8443
VITE_REAL_NAME=HTTPS_localhost_realm

VITE_HTTPS_CLIENT_ID=https_localhost_client_id

And this is .gitignore file:

**/.DS_Store
.DS_Store
Thumbs.db
.env
.venv/
.env.local
.env.development
.env.test.local
.env.production
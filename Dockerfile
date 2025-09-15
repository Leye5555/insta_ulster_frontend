FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# do not build the app in the container
# this ensures that env variables are available
# when built later in azure
CMD ["sh", "-c", "npm run build && npm start"]

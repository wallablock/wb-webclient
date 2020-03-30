FROM node:lts-alpine AS builder

# Packages to build C++ extensions for Node.js, for those packages that
# require them
RUN apk add --no-cache python make g++

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

FROM node:lts-alpine AS builder

# Packages to build C++ extensions for Node.js, for those packages that
# require them, as well as Git to download dependencies
RUN apk add --no-cache python make g++ git

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

COPY public/ public/
COPY src/ src/

RUN npm run build

FROM nginx:stable-alpine
COPY nginx/ /etc/nginx/
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

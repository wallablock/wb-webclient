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
COPY certificates/ /etc/nginx/ssl/
RUN \
    cd /etc/nginx/conf.d && \
    if [ -f ../ssl/ssl.crt ]; then \
        if [ -f ../ssl/ssl.key ]; then \
            echo "Certificates found. HTTPS enabled" && \
            rm default.conf &&
            ln -s https.conf default.conf; \
        else \
            echo "Error: Certificate exists but no key found" 1>&2 && \
            exit 1; \
        fi; \
    else \
        echo "Certificates not found. HTTPS disabled" && \
        rm default.conf &&
        ln -s http.conf default.conf; \
    fi;
COPY config/ /etc/wallablock/

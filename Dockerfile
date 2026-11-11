FROM node:24.22.2@sha256:8fa96264f302f58bbb13aa7339c541547b56975766ce956c875da149452a3e40

# Create app directory
WORKDIR /lama-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]

LABEL org.opencontainers.image.source="https://github.com/Lippesola/lama-api"

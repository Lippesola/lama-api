FROM node:26.13.1-slim@sha256:abe7e5a82b61a8ef67b315b85497c9e65173387ccf2f4a029248184b8e020be5

ENV NODE_ENV=production
WORKDIR /lama-api

# Install production dependencies from the lockfile
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bundle app source
COPY --chown=node:node . .
RUN mkdir -p uploads/avatar && chown -R node:node uploads

USER node

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD node -e "fetch('http://localhost:8080/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["node", "index.js"]

LABEL org.opencontainers.image.source="https://github.com/Lippesola/lama-api"

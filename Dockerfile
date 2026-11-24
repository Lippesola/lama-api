FROM node:24.22.3-slim@sha256:32e57b5784e8875d2cc0112dcaf13f9100f2d0d9446187808738e99aee29a5a2

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

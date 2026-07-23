# build stage
FROM node:22-alpine AS build-stage
WORKDIR /app

# Chromium is used by the post-build prerender step (npm run prerender) to
# snapshot each project blog to static HTML for SEO / social link previews.
# Installed early so this layer stays cached across code changes.
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
ENV SITE_ORIGIN=https://milovanderpas.nl

COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .

# Baseline env from the template; the API_URL build arg below takes priority over .env
RUN cp -f .env.dist .env

ARG API_URL
ENV VITE_API_URL=$API_URL

RUN npm run build

# Prerender project pages into dist/project/<slug>.html (see nginx.conf try_files)
RUN npm run prerender

# production stage
FROM nginx:stable-alpine AS production-stage
COPY frontend/nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]

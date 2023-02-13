# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY /frontend /app
RUN npm install

RUN cp -f .env.dist .env
ARG API_URL
RUN sed -i "s|VITE_API_URL=|VITE_API_URL=${API_URL}|g" .env

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY /frontend/nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

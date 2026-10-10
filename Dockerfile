# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# VITE_* values are baked into the bundle at build time
ARG VITE_API_BASE
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_VAPID_KEY
RUN npm run build

# ---- serve ----
FROM nginx:1.27-alpine
# nginx image renders *.template with envsubst at start ($BACKEND_HOST); nginx vars ($host...) are untouched
ENV BACKEND_HOST=prod.tibstation.uz
ENV NGINX_ENVSUBST_FILTER=BACKEND_
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

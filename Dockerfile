# Etapa 1: build da SPA
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Etapa 2: servidor web leve, sem root
FROM nginxinc/nginx-unprivileged:1.29-alpine
# aplica correções de segurança dos pacotes da imagem base e remove o curl (não é usado)
USER root
RUN apk upgrade --no-cache && (apk del --no-cache curl || true)
USER 101
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health.json || exit 1

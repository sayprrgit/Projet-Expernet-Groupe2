# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Stage de développement avec HMR (Hot Module Replacement)
FROM base AS dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage de build pour la production
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

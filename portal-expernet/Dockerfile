# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Stage de développement avec rechargement à chaud
FROM base AS dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Stage de build pour la production
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage de production optimisé
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN [ "npm", "run", "prisma:generate" ]

RUN [ "npm", "run", "build" ]
EXPOSE 3000
CMD [ "npm", "run", "docker-start" ]

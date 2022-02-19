FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

#COPY ./dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:dev"]


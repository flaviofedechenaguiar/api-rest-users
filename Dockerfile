FROM node:alpine
WORKDIR /
COPY package*.json ./
RUN npm install
ENV PATH=/node_modules/.bin:$PATH

WORKDIR /usr/app/
COPY . ./
CMD ["npm", "start"]
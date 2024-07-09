FROM node:18.16.0

# EXPOSE $PORT

WORKDIR /ecommerce_api

# RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm i

COPY . .

CMD [ "npm", "start" ]
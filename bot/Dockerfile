FROM alpine:3 AS build
WORKDIR /app/bot

RUN apk --no-cache add "nodejs~=18" "npm~=9"

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "src/index.js"]

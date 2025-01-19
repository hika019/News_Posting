FROM --platform=amd64 node:23.6.0-alpine3.21
RUN mkdir /discord-bot && chown node:node /discord-bot
COPY ./*.js /discord-bot/
COPY ./*.json /discord-bot/
COPY ./commands /discord-bot/commands
WORKDIR /discord-bot
RUN npm install

# 日本時間に設定
RUN ln -sf  /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

ENV TZ=Asia/Tokyo
CMD ["node", "index.js"]

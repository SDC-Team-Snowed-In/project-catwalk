FROM node:14.15.3
    WORKDIR /next
    COPY . .
    RUN npm install
    RUN ["apt-get", "update"]
    RUN ["apt-get", "-y", "install", "vim"]

    EXPOSE 3001

    CMD ["node_modules/.bin/next", "start"]
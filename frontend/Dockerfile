FROM node as builder

WORKDIR /app

COPY ./package.json .
RUN npm install
COPY ./src /app/src
COPY ./webpack.config.js .
RUN npm run build

FROM nginx

COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
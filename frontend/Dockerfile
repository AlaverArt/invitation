FROM node as builder

WORKDIR /app

COPY ./package.json .
COPY ./.browserslistrc .
COPY ./src /app/src
COPY ./webpack.config.js .
COPY ./index.html .
RUN npm install -y && npm run build

FROM nginx

COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

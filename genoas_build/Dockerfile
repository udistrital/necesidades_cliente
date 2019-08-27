FROM node:7.10-alpine
RUN apk --no-cache add git
RUN npm install -g grunt-cli bower yo generator-karma generator-oas
USER node
WORKDIR /app
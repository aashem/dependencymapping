FROM alpine
RUN apk add vim
FROM node:latest
WORKDIR /usr/webapp/src
COPY package.json .
COPY src src/.
COPY public public/.
RUN ls
# if run with compose use docker-entrypoint.sh
# to install node_modules
RUN npm install
COPY docker-entrypoint.sh .
EXPOSE 3000
# set env variables which
# are set by the environment
# file passed by ../docker-compose.yaml
# in dev and prod. (default localhost:8000)
RUN pwd
RUN ls
CMD ["npm", "start"] 

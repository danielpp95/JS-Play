FROM node:15.12.0

RUN npm install -g http-server

WORKDIR /app

ADD . .

#RUN npm install

# ENTRYPOINT ["/entrypoint.sh"]

#RUN npm run build

EXPOSE 10000
#CMD [ "http-server", "dist", "--port",  "10000" ]

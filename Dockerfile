FROM google/nodejs

WORKDIR /app

ADD . /app

RUN npm install

RUN ./node_modules/bower/bin/bower install --allow-root

RUN ./node_modules/grunt-cli/bin/grunt

CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]

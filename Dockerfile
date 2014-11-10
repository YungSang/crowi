FROM google/nodejs

WORKDIR /app

ADD package.json /app/
RUN npm install

ADD bower.json /app/
RUN ./node_modules/bower/bin/bower install --allow-root

ADD . /app
RUN ./node_modules/grunt-cli/bin/grunt

CMD []
ENTRYPOINT ["/nodejs/bin/npm", "start"]

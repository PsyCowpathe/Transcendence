FROM alpine:latest

RUN apk upgrade \
&& apk update \
&& apk add vim \
&& apk add zsh \
&& apk add bash

RUN apk add curl

RUN apk add nodejs npm

RUN apk add git

RUN npm install --global yarn@latest

RUN cd  && \
echo 'y' | echo | yarn create react-app frontend --template=typescript

RUN rm -rf ~/frontend/src

RUN mkdir ~/frontend/src/

COPY ./src/* /root/frontend/src/

RUN cd && cd frontend/public && rm -rf index.html

RUN cd && cd frontend/src && mv index.html /root/frontend/public/

COPY ./tools/init.sh ./

COPY ./config/package.json /root/frontend/

COPY ./config/tsconfig.json /root/frontend/

COPY ./config/yarn.lock /root/frontend/

RUN cd /root/frontend/ && \
yarn install && \
yarn upgrade

RUN chmod +x init.sh

EXPOSE 3000

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT  ["./init.sh"]


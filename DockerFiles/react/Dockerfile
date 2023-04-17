FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g npm@latest

RUN apt-get install -y git

RUN npm install --global yarn@latest

RUN cd  && \
echo 'y' | echo | yarn create react-app frontend --template=typescript

COPY ./config/package.json /root/frontend/ 

COPY ./config/tsconfig.json /root/frontend/ 

COPY ./config/yarn.lock /root/frontend/ 

RUN cd ~/frontend/ \
&& yarn install

RUN rm -rf ~/frontend/src

RUN mkdir ~/frontend/src/

COPY ./src/* /root/frontend/src/

COPY ./tools/init.sh ./

RUN chmod +x init.sh



EXPOSE 3000

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT  ["./init.sh"]


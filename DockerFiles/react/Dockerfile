FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y curl
#RUN apt-get install -y xdg-utils

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g npm@latest
#RUN npm install -g @vue/cli


RUN apt-get install -y git

RUN npm install --global yarn



RUN cd  && \
echo 'y' | echo | yarn create react-app frontend --template=typescript && cd frontend && yarn add mini.css@3.0.1 && yarn add axios && yarn add react-router-dom@latest && yarn add react-cookie 

RUN rm -rf ~/frontend/src

RUN mkdir ~/frontend/src/

COPY ./src/* /root/frontend/src/

COPY ./tools/init.sh ./

RUN chmod +x init.sh



EXPOSE 3000

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT  ["./init.sh"]


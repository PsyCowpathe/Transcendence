FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y curl
#RUN apt-get install -y xdg-utils

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g npm@latest

RUN apt-get install -y git

EXPOSE 5173

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT ["zsh"]


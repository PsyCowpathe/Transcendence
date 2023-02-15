FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y curl

RUN apt-get install -y procps

RUN apt-get install -y git

RUN git clone https://github.com/leafgarland/typescript-vim.git ~/.vim/pack/typescript/start/typescript-vim

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g npm@latest

RUN npm install -g @nestjs/cli

RUN cd \
&& echo -n $'\034' | echo | nest new backend

RUN rm -rf ~/backend/src

RUN mkdir ~/backend/src/

COPY ./Dockerfile ~/backend/src/

RUN cd \
&& cd backend \
&& npm install dotenv --save 

EXPOSE 3000

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

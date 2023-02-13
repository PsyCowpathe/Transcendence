FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g npm@latest

RUN npm install -g @nestjs/cli

RUN apt-get install -y git


RUN sh -c "$(curl -fsSL -y hgit clone https://github.com/nestjs/typescript-starter.git projectttps://raw.githubsercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

EXPOSE 3000

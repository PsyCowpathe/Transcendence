FROM debian:11.5

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install -y zsh

RUN apt-get install -y git

RUN apt-get install -y curl

RUN apt-get install -y npm

RUN yes Y | sh -c "$(curl -fsSL -y hgit clone https://github.com/nestjs/typescript-starter.git projectttps://raw.githubsercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN git clone https://github.com/nestjs/typescript-starter.git project

RUN cd project \
&& npm install 

EXPOSE 3000

ENTRYPOINT ["echo" "npm" "run" "start"]

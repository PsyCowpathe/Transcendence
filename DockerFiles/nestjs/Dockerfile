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

RUN npm install --global yarn

RUN yarn global add @nestjs/cli

RUN cd \ 
&& nest new --strict backend -p yarn

RUN rm -rf ~/backend/src \
&&	rm -rf ~/backend/tsconfig.build.json

RUN mkdir ~/backend/secret \
&& cd ~/backend/secret \
&& openssl req -x509 -nodes -days 365 -subj "/C=FR/ST=France/L=Lyon/O=42/OU=42/CN=agirona" -newkey rsa:4096 -keyout ./cert.key -out ./cert.crt

RUN mkdir ~/backend/src/

COPY ./src/* /root/backend/src/

COPY ./tools/init.sh ./

COPY ./config/tsconfig.build.json /root/backend/

COPY ./config/vimrc.local /etc/vim/

RUN chmod +x init.sh

RUN cd \
&& cd backend \
&& yarn add dotenv \
&& yarn add axios \
&& yarn add @nestjs/axios \
&& yarn add @nestjs/typeorm typeorm pg \
&& yarn add cookie-parser \
&& yarn add @types/cookie-parser \
&& yarn add bcrypt \
&& yarn add @types/bcrypt

EXPOSE 3630

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT [ "./init.sh" ]

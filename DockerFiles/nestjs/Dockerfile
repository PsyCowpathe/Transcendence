FROM alpine:latest

RUN apk upgrade \
&& apk update \
&& apk add vim \
&& apk add zsh \
&& apk add bash

RUN apk add curl

RUN apk add procps

RUN apk add git

RUN git clone https://github.com/leafgarland/typescript-vim.git ~/.vim/pack/typescript/start/typescript-vim

RUN apk add nodejs npm

RUN npm install --global yarn

RUN yarn global add @nestjs/cli

RUN cd \ 
&& nest new --strict backend -p yarn

RUN rm -rf ~/backend/src \
&&	rm -rf ~/backend/tsconfig.build.json \
&& rm -rf ~/backend/package.json \
&& rm -rf ~/backend/yarn.lock \
&& rm -rf ~/backend/nest-cli.json \
&& rm -rf ~/backend/tsconfig.json

RUN mkdir ~/backend/src/ \
&& mkdir ~/backend/avatars/

COPY ./src/* /root/backend/src/

COPY ./tools/init.sh ./

COPY ./config/tsconfig.build.json /root/backend/

COPY ./config/vimrc.local /etc/vim/

COPY ./config/default.png /root/backend/avatars

COPY ./config/package.json /root/backend/

COPY ./config/yarn.lock /root/backend/

COPY ./config/nest-cli.json /root/backend/

COPY ./config/tsconfig.json /root/backend/

RUN cd /root/backend \
&& yarn install \
&& yarn upgrade

RUN chmod +x init.sh

EXPOSE 3630 3631 3632 3633 3634

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT [ "./init.sh" ]

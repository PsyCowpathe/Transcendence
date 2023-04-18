FROM alpine:latest

RUN apk upgrade \
&& apk update \
&& apk add vim \
&& apk add zsh \
&& apk add bash

RUN apk add curl

RUN  apk add nodejs npm

RUN apk add git

RUN npm install --global yarn@latest

RUN cd  && \
echo 'y' | echo | yarn create react-app frontend --template=typescript 

#RUN cd && cd frontend && yarn add mini.css@3.0.1 && yarn add axios && yarn add react-cookie@latest 

#RUN cd && cd frontend && yarn add @types/react-icons@latest && yarn upgrade @types/react-icons@latest && yarn add react-router-dom@latest @types/react-router-dom@latest && yarn upgrade react-router-dom@latest &&  yarn upgrade @types/react-router-dom@latest && yarn upgrade react-scripts && yarn add react-toastify

#RUN cd && cd frontend &&  yarn add @types/socket.io-client && yarn add @types/react-dropzone 

#RUN cd && cd frontend && yarn add @mui/material @emotion/react @emotion/styled && yarn add @mui/material @mui/styled-engine-sc styled-components && yarn add @mui/icons-material 

#RUN cd && cd frontend && yarn add qrcode.react
#RUN cd && cd frontend && yarn add otpauth && yarn install

RUN rm -rf ~/frontend/src

RUN mkdir ~/frontend/src/

COPY ./src/* /root/frontend/src/

COPY ./tools/init.sh ./

COPY ./config/package.json /root/frontend/

COPY ./config/tsconfig.json /root/frontend/

COPY ./config/yarn.lock /root/frontend/

RUN cd /root/frontend/ \
&& yarn install

RUN chmod +x init.sh

EXPOSE 3000

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

ENTRYPOINT  ["./init.sh"]


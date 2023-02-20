FROM debian:buster

RUN apt-get upgrade -y \
&& apt-get update -y \
&& apt-get install -y vim \
&& apt-get install wget -y \
&& apt-get install zsh -y \
&& apt-get install git -y \
&& apt-get install curl -y

RUN apt-get install postgresql -y

RUN apt-get update -y

RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

RUN ln -f /bin/zsh /bin/sh

EXPOSE 5432

#Delete default pg_hba conf file

RUN rm -rf /etc/postgresql/11/main/pg_hba.conf

#Import custom pg_hba file with trust option (trust)

COPY ./src/trust.conf /etc/postgresql/11/main/

#Import custom pg_hba file with secure option (md5)

COPY ./src/pg_hba.conf /etc/postgresql/11/main/

RUN echo "host	all		all		0.0.0.0/0		md5" >> /etc/postgresql/11/main/pg_hba.conf 

RUN sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/11/main/postgresql.conf

RUN mv /etc/postgresql/11/main/pg_hba.conf /etc/postgresql/11/main/protected.conf  

RUN mv /etc/postgresql/11/main/trust.conf /etc/postgresql/11/main/pg_hba.conf  

#Import script that will setup db password

COPY ./tools/init.sh ./

RUN chmod +x init.sh

ENTRYPOINT [ "./init.sh" ] 


#!/bin/bash

#Start postgresql service

service postgresql start

#Setup the password for default user "postgres"

if ! [ -f done ]
then	
	psql -U postgres -c "ALTER USER postgres PASSWORD '$DB_PSWD';"
fi

#Delete pg_hba file with trust option

if ! [ -f done ]
then	
	rm -rf /etc/postgresql/11/main/pg_hba.conf
fi

#Set pg_hba file with secured option (md5)

if ! [ -f done ]
then	
	mv /etc/postgresql/11/main/protected.conf /etc/postgresql/11/main/pg_hba.conf 
fi

#Restart service

if ! [ -f done ]
then	
	service postgresql restart
	touch done
fi

#Connect to db

psql postgresql://postgres:$DB_PSWD@localhost:5432

service postgresql status

tail -f

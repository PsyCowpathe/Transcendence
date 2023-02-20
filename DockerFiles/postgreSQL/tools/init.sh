#!/bin/bash

#Start postgresql service

service postgresql start

#Setup the password for default user "postgres"

psql -U postgres -c "ALTER USER postgres PASSWORD '$DB_PSWD';"

#Delete pg_hba file with trust option

rm -rf /etc/postgresql/11/main/pg_hba.conf

#Set pg_hba file with secured option (md5)

mv /etc/postgresql/11/main/protected.conf /etc/postgresql/11/main/pg_hba.conf 

#Restart service

service postgresql restart

#Connect to db

psql postgresql://postgres:$DB_PSWD@localhost:5432

tail -f

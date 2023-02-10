OUTPUT=$(docker container ps -aq)
docker stop ${OUTPUT}

docker system prune -a -f

OUTPUT=$(docker images -aq)
docker rmi -f ${OUTPUT}

OP=$(docker volume ls -q)
docker volume rm ${OP}

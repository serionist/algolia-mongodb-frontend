FROM mongo:latest
ARG INIT_COLLECTION_URL
ENV MONGO_USER=''
ENV MONGO_PASSWORD=''
ENV MONGO_DB=''
ENV MONGO_COLLECTION=''
RUN apt update -y && apt install -y wget && \
   wget -O /init-data.json $INIT_COLLECTION_URL


ENTRYPOINT [ "bash", "-c", "mongoimport --drop --host mongodb --username $MONGO_USER --password $MONGO_PASSWORD --authenticationDatabase admin --db $MONGO_DB --collection $MONGO_COLLECTION --file /init-data.json" ]

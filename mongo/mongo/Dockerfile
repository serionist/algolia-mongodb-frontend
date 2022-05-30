FROM buildpack-deps:curl AS download-env

ARG INIT_COLLECTION_URL 
RUN wget -O /init-data.json $INIT_COLLECTION_URL

FROM mongo:latest AS runtime-env
COPY --from=download-env /init-data.json /init-data.json

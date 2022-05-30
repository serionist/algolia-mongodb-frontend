#!/bin/bash

mongoimport \
  --drop \
  --host "localhost" \
  --db "$MONGO_INITDB_DATABASE" \
  --collection "$INIT_COLLECTION" \
  --file "/init-data.json"
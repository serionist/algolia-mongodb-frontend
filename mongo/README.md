# Init mongodb with sample data

1. rename `.env.tmpl` to `.env` and set your preferred passwords
1. `docker-compose up`

### Initial db

- initial seed data url: `INIT_COLLECTION_URL=https://raw.githubusercontent.com/budavariam/mongodb-sample-dataset/main/sample_airbnb/listingsAndReviews.json`
- init database in mongo: `MONGO_INITDB_DATABASE=airbnb`
- init collection in the db: `INIT_COLLECTION=listingsAndReviews`

### Port forwards

- mongo: localhost:27017
- mongo gui: localhost:8081

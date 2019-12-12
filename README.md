# node-samples

### Overview

This repo contains sample code for a series of apps in Heroku, and demonstrates interactions between a Web Form, Kafka, Postgres, Salesforce Platform Events.

The sequence is:

1. User provides input to a web form,
1. then the [web form app](/form/) sends a message to the [producer app](/producer/), 
1. which puts that message to [Kafka](https://www.heroku.com/kafka) (running on Heroku).
1. The [consumer app](/consumer/) reads messages from the Kafka bus, 
1. then inserts the message into a [Posgres DB](https://www.heroku.com/postgres) (running on Heroku).
1. There is a trigger on the Postgres DB that tells a [notifier app](/notifier/)
1. to let the [platform-events app](/platform-events/) to push the message to Salesforce.


### Folder Structure and Files

```
.
├── README.md
├── consumer
│   ├── Procfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── form
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── views
│       ├── home.hbs
│       └── layouts
│           └── main.hbs
├── notifier
│   ├── Procfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── platform-events
│   ├── Procfile
│   ├── package-lock.json
│   ├── package.json
│   └── pe.js
├── producer
│   ├── Procfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── triggers.sql

```

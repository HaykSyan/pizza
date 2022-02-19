## Installation

copy .env.example to root dir and rename to .env

### Default .env configs 
```bash
NODE_ENV=production
PORT=3000

DB_HOST=mongodb
DB_PORT=27017
DB_USER=root
DB_PASSWORD=root
DB_NAME=pizza-delivery

REDIS_HOST=redis
REDIS_PORT=6379
```

## Running and install the app

```bash
# with docker
$ docker-compose up --build
```

Senior backend developer coding exercise

## Project setup

```bash
$ npm install
```

## Docker Compose

Make sure to stop any local Postgres or RabbitMQ instances to avoid port conflicts.

For example, on Linux with Systemd:

```bash
sudo systemctl stop postgresql
sudo systemctl stop rabbitmq-server
```

Start all services via Docker Compose:

```bash
docker compose up -d --build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

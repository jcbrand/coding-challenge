# NestJS GraphQL API with PostgreSQL and RabbitMQ

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start services:
```bash
docker compose up -d --build
```

## Testing the Application

### GraphQL API Testing

Access the GraphQL Playground at:  
http://localhost:3000/graphql  
(make sure to include the trailing slash if needed)

#### Create an Edge
```graphql
mutation {
  createEdge(node1_alias: "nodeA", node2_alias: "nodeB") {
    id
    node1_alias
    node2_alias
    capacity
    created_at
    updated_at
  }
}
```

#### Query All Edges
```graphql
query {
  getEdges {
    id
    node1_alias
    node2_alias
    capacity
  }
}
```

#### Query Single Edge
```graphql
query {
  getEdge(id: "your-edge-id-here") {
    id
    node1_alias
    node2_alias
    capacity
  }
}
```

### Monitoring Services

1. **View API Logs**:
```bash
docker compose logs -f api
```

2. **RabbitMQ Dashboard**:  
http://localhost:15672  
Credentials: guest/guest

3. **PostgreSQL Access**:
```bash
docker compose exec db psql -U postgres nest
```

## Architecture Flow

1. GraphQL mutation creates edge → saves to Postgres
2. Service publishes message to RabbitMQ
3. Consumer receives message → updates aliases (appends "-updated")
4. Updated edge saved back to Postgres
5. Query shows final updated state

## Running the Server

```bash
# development mode
npm run start:dev

# production mode
npm run start:prod
```

## Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Environment Variables

Configured in docker-compose.yml:
- Database: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Message Queue: `RABBITMQ_URL`

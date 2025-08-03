# NestJS GraphQL API with PostgreSQL and RabbitMQ

## Development Setup

1. Install NPM dependencies (if you want to run tests locally):
```bash
npm install
```

2. Start services:
```bash
docker compose up -d --build
```

## Testing the Application

You can visit the landing page at http://localhost:3000/

### GraphQL API Testing

Access the GraphQL Playground at:  http://localhost:3000/graphql  

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

1. **API Service**:
```bash
# View logs
docker compose logs -f api

# Access shell
docker compose exec api sh
```

2. **RabbitMQ**:
```bash
# View logs
docker compose logs -f rabbitmq

# Management Dashboard:  
http://localhost:15672  
Credentials: guest/guest

# List queues
docker compose exec rabbitmq rabbitmqadmin list queues
```

3. **PostgreSQL**:
```bash
# View logs
docker compose logs -f db

# Access database shell
docker compose exec db psql -U postgres nest

# Run queries
docker compose exec db psql -U postgres nest -c "SELECT * FROM edge;"
```

4. **Service Status**:
```bash
# Check running containers
docker compose ps

# View resource usage
docker stats
```

## Architecture Flow

1. GraphQL mutation creates edge → saves to Postgres
2. Service publishes message to RabbitMQ
3. Consumer receives message → updates aliases (appends "-updated")
4. Updated edge saved back to Postgres
5. Query shows final updated state

## Running the Server

### Development Mode
```bash
npm run start:dev
```
- Watches for file changes and auto-restarts
- Access GraphQL Playground at http://localhost:3000/graphql

### Production Mode
```bash
npm run build
npm run start:prod
```
- Runs compiled JavaScript from dist/ directory
- Optimized for performance

## Running Tests

### Unit Tests
```bash
npm run test
```
- Tests individual components and services
- Runs in watch mode by default

### Test Coverage
```bash
npm run test:cov
```
- Generates coverage report in coverage/ directory
- Helps identify untested code paths

### Debugging Tests
```bash
npm run test:debug
```
- Runs tests with debugger attached
- Useful for troubleshooting failing tests

## Environment Variables

Configured in docker-compose.yml:
- Database: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Message Queue: `RABBITMQ_URL`

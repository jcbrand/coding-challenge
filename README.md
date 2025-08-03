# NestJS GraphQL API with PostgreSQL and RabbitMQ

## Development Setup

Start services:
```bash
docker compose up -d --build
```

## Manually Testing the Application

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
    edge_peers
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
    edge_peers
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
    edge_peers
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

## Running Automated Tests

First install the NPM dependencies
```bash
npm install
```

### Unit Tests
```bash
npm run test
```
- Tests individual components and services

### Test Coverage
```bash
npm run test:cov
```
- Generates coverage report in coverage/ directory
- Helps identify untested code paths

## Environment Variables

Configured in docker-compose.yml:
- Database: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Message Queue: `RABBITMQ_URL`

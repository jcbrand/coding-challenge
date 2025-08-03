import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Network Graph API</title>
        <style>
          :root {
            --primary: #2563eb;
            --secondary: #1e40af;
            --bg: #f8fafc;
            --text: #1e293b;
            --card-bg: #ffffff;
          }
          body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.5;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            color: var(--text);
            background-color: var(--bg);
          }
          h1 {
            color: var(--secondary);
            margin-bottom: 1.5rem;
          }
          .card {
            background: var(--card-bg);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-left: 4px solid var(--primary);
          }
          .card h2 {
            margin-top: 0;
            color: var(--primary);
          }
          a {
            color: var(--primary);
            font-weight: 500;
          }
          code {
            background: #e2e8f0;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: 'SF Mono', monospace;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          .footer {
            margin-top: 2rem;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <h1>Network Graph API Service</h1>
        <p>Manage and analyze network edges between nodes with this GraphQL API service.</p>
        
        <div class="grid">
          <div class="card">
            <h2>GraphQL Playground</h2>
            <p>Interactively explore and test the API:</p>
            <p><a href="/graphql" target="_blank">/graphql</a></p>
            <h3>Key Operations:</h3>
            <ul>
              <li><code>createEdge</code> - Establish new connections</li>
              <li><code>getEdges</code> - List all edges</li>
              <li><code>getEdge</code> - Get specific edge details</li>
            </ul>
          </div>

          <div class="card">
            <h2>RabbitMQ Dashboard</h2>
            <p>Monitor message queue activity:</p>
            <p><a href="http://localhost:15672" target="_blank">http://localhost:15672</a></p>
            <p>Credentials: <code>guest</code> / <code>guest</code></p>
            <h3>Message Flow:</h3>
            <ol>
              <li>Edge created via GraphQL</li>
              <li>Message published to queue</li>
              <li>Consumer updates node aliases</li>
            </ol>
          </div>
        </div>

        <div class="card">
          <h2>Database Schema</h2>
          <p>Edges contain:</p>
          <ul>
            <li><code>id</code> - Unique identifier</li>
            <li><code>node1_alias</code>, <code>node2_alias</code> - Connected nodes</li>
            <li><code>capacity</code> - Connection capacity</li>
            <li><code>created_at</code>, <code>updated_at</code> - Timestamps</li>
          </ul>
        </div>

        <div class="footer">
          <p>Service running on port 3000 | Check README for complete documentation</p>
        </div>
      </body>
      </html>
    `);
  }
}

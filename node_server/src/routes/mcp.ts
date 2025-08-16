

import { Router } from 'express';
import { executeMCPQuery } from '../services/mcpClient.ts';
const router = Router();

router.post('/query', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Missing SQL query.' });
  }
  try {
    const result = await executeMCPQuery(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// MCP status endpoint

router.get('/status', async (req, res) => {
  try {
    // Simulate MCP connection check (replace with real MCP client logic)
    const mcpUrl = process.env.MCP_SERVER_URL;
    if (!mcpUrl) {
      return res.status(500).json({ connected: false, error: 'MCP server URL not configured.' });
    }

    // TODO: Replace with actual MCP client connection and metadata fetch
    // For now, stub as connected and return static metadata
    res.json({
      connected: true,
      server_url: mcpUrl,
      transport: 'http',
      tools: [
        { name: 'execute_query', description: 'Execute SQL queries on the database' }
      ],
      resources: [
        { name: 'metadata', uri: 'database://metadata' }
      ],
      database_metadata: { tables: ['sample_table'], columns: { sample_table: ['id', 'name'] } }
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err instanceof Error ? err.message : String(err) });
  }
});

export { router as mcpRouter };

import axios from 'axios';
import { config } from '../config.ts';

export async function executeMCPQuery(query: string) {
  try {
    const response = await axios.post(`${config.MCP_SERVER_URL}/mcp`, {
      tool: 'execute_query',
      params: { query }
    });
    // Adapt response to match Python's MCPQueryResult
    const result = response.data;
    return {
      success: result.success ?? true,
      data: result.data ?? result.rows ?? [],
      columns: result.columns ?? [],
      error: result.error ?? null,
      row_count: (result.data ?? result.rows ?? []).length
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Query execution error',
      data: [],
      columns: [],
      row_count: 0
    };
  }
}

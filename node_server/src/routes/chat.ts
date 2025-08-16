import { Router } from 'express';
import axios from 'axios';
const router = Router();

// POST /chat/completions - OpenAI compatible endpoint

router.post('/completions', async (req, res) => {

  try {
    const { messages, max_tokens, temperature, stream } = req.body;
    let model;

    if (process.env.LLM_PROVIDER === 'openrouter')
      model = process.env.OPENROUTER_MODEL
    else
      model = process.env.GEMINI_MODEL;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array cannot be empty' });
    }

    // Get latest user message
    const userMessage = messages[messages.length - 1]?.content || '';

    // Simple database query detection (stub)
    const needsDatabase = /select|from|where|join|table|database/i.test(userMessage);
    let mcpContext: any = {};
    let queryResult: any = null;

    if (needsDatabase) {
      // Stub: fetch metadata and query result from MCP
      // TODO: Replace with real MCP client logic
      mcpContext.database_metadata = { tables: ['sample_table'], columns: { sample_table: ['id', 'name'] } };
      // Stub: extract SQL query (very basic)
      const sqlMatch = userMessage.match(/select.+from.+/i);

      if (sqlMatch) {
        // Simulate query result
        queryResult = { success: true, data: [{ id: 1, name: 'Alice' }], columns: ['id', 'name'], row_count: 1 };
        mcpContext.query_results = queryResult;
      }
      mcpContext.available_tools = [
        { name: 'execute_query', description: 'Execute SQL queries on the database' }
      ];
    }

    let llmResponse;
    if (model && model.toLowerCase().includes('gemini')) {
      // Call Gemini API (stubbed, replace with real endpoint and key)
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      // Gemini expects a different payload structure
      const geminiPayload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ]
      };
      llmResponse = await axios.post(
        `${geminiUrl}?key=${geminiApiKey}`,
        geminiPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Normalize Gemini response to OpenAI format
      const choices = [{ message: { role: 'assistant', content: llmResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '' } }];

      if (queryResult) (choices[0] as any).query_result = queryResult;
      res.json({ choices });
    } else {
      // Call OpenRouter API with MCP context
      const openrouterResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        { messages, model, max_tokens, temperature, stream, mcp_context: mcpContext },
        { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
      );
      // Add query result to first choice if present
      if (queryResult && openrouterResponse.data.choices && openrouterResponse.data.choices.length > 0) {
        openrouterResponse.data.choices[0].query_result = queryResult;
      }
      res.json(openrouterResponse.data);
    }
  } catch (err: any) {
    // FastAPI-like error handling
    let errorMessage = "I apologize, but I encountered an error processing your request.";
    const errStr = err?.message || String(err);

    if (/rate limit|429/i.test(errStr)) {
      errorMessage = "I'm currently experiencing high demand and need to wait a moment before processing your request. Please try again in a few seconds.";
    } else if (/timeout/i.test(errStr)) {
      errorMessage = "Your request took too long to process. Please try again with a simpler question or try again later.";
    } else if (/api/i.test(errStr)) {
      errorMessage = "I'm having trouble connecting to the AI service. Please try again in a moment.";
    } else {
      errorMessage = `I encountered an unexpected error: ${errStr}`;
    }

    // OpenAI-compatible error response
    res.status(500).json({
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: errorMessage
          },
          finish_reason: "error"
        }
      ]
    });
  }
});

// Example route
router.get('/', (req, res) => {
  res.send('Chat route is working!');
});

export { router as chatRouter };



import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { healthRouter } from './routes/health.ts';
import { chatRouter } from './routes/chat.ts';
import { modelsRouter } from './routes/models.ts';
import { mcpRouter } from './routes/mcp.ts';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: true })); // Enable CORS for all origins (dev)

app.use('/health', healthRouter);
app.use('/chat', chatRouter);
app.use('/models', modelsRouter);
app.use('/mcp', mcpRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});

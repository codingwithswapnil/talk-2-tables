// Configuration management using dotenv
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  MCP_SERVER_URL: process.env.MCP_SERVER_URL || '',
  PORT: process.env.PORT || 3001,
};

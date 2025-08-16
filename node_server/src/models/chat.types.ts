// Type definitions for chat requests and responses

export interface ChatRequest {
  prompt: string;
  model: string;
}

export interface ChatResponse {
  response: string;
}

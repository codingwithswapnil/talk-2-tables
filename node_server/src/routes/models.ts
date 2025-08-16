
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  try {
    // Simulate connection check (could call OpenRouter API or config)
    const models = ['openrouter', 'gemini'];
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export { router as modelsRouter };

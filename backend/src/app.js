import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { etlRouter } from './routes/etl.js';
import { authenticate } from './middleware/auth.js';

export function createApp(env, io) {
  const app = express();
  app.use(helmet()); app.use(cors({ origin: env.clientOrigin })); app.use(express.json({ limit: '64kb' }));
  app.get('/health', (_, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRouter(env));
  app.use('/api/etl', authenticate(env.jwtSecret), etlRouter({ uploadDir: env.uploadDir, io }));
  app.use((error, _, res, __) => { console.error(error); res.status(500).json({ error: 'Internal server error.' }); });
  return app;
}

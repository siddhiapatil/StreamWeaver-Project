import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { pipelineRouter } from './routes/pipelines.js';
import { etlRouter } from './routes/etl.js';
import { authenticate } from './middleware/auth.js';

export function createApp(env, io) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: '64kb' }));

  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter(env));
  app.use('/api/pipelines', authenticate(env.jwtSecret), pipelineRouter());
  app.use('/api/etl', authenticate(env.jwtSecret), etlRouter({ uploadDir: env.uploadDir, io }));

  // Anything under /api that didn't match a route above is a clean 404
  // instead of falling through to the generic error handler.
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

  // Central error handler. Errors thrown as AppError carry their own status
  // and a message that's safe to show the client; anything else is logged
  // server-side and reported to the client as a generic 500.
  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    if (status >= 500) console.error(error);
    res.status(status).json({ error: error.expose ? error.message : 'Internal server error.' });
  });

  return app;
}

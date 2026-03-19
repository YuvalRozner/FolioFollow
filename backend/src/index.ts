import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import { env } from './config/env';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/authRoutes';
import { accountRouter } from './routes/accountRoutes';
import { securityRouter } from './routes/securityRoutes';
import { exchangeRateRouter } from './routes/exchangeRateRoutes';
import { transactionRouter } from './routes/transactionRoutes';
import { lotRouter } from './routes/lotRoutes';
import { portfolioRouter } from './routes/portfolioRoutes';
import { cashRouter } from './routes/cashRoutes';
import { adminRouter } from './routes/adminRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((item) => item.trim()) }));
app.use(express.json());
app.use((req, res, next) => {
  req.requestId = uuidv4();
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(`[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use(env.apiPrefix, authenticate);
app.use(`${env.apiPrefix}/auth`, authRouter);
app.use(`${env.apiPrefix}/accounts`, accountRouter);
app.use(`${env.apiPrefix}/securities`, securityRouter);
app.use(`${env.apiPrefix}/exchange-rates`, exchangeRateRouter);
app.use(`${env.apiPrefix}/transactions`, transactionRouter);
app.use(`${env.apiPrefix}/lots`, lotRouter);
app.use(`${env.apiPrefix}/portfolio`, portfolioRouter);
app.use(`${env.apiPrefix}/cash`, cashRouter);
app.use(`${env.apiPrefix}/admin`, adminRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`FolioFollow backend listening on port ${env.port}`);
});

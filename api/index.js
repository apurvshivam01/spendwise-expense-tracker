import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/src/routes/authRoutes.js';
import transactionRoutes from '../server/src/routes/transactionRoutes.js';
import budgetRoutes from '../server/src/routes/budgetRoutes.js';
import analyticsRoutes from '../server/src/routes/analyticsRoutes.js';
import notificationRoutes from '../server/src/routes/notificationRoutes.js';
import { connectDB } from '../server/src/config/db.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://trackwithspendwise.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`Blocked by CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().catch(console.error);

const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SpendWise API Server',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Also mount without /api prefix in case rewrite strips it
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/notifications', notificationRoutes);

export default app;

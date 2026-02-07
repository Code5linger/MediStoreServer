import express, { type Application } from 'express';
import { MedicineRouter } from './modules/medicine/medicine.router';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import { CategoryRouter } from './modules/category/category.router';
import { OrderRouter } from './modules/order/order.router';
import { ReviewRouter } from './modules/review/review.router';
import { AdminRouter } from './modules/admin/admin.router';

const app: Application = express();

app.use(express.json());

// app.use(
//   cors!({
//     origin: process.env.APP_URL || 'http://localhost:3000',
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true, // CRITICAL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  }),
);

// Better Auth routes
// app.all('/api/auth/*splat', toNodeHandler(auth));

app.all('/api/auth/*', toNodeHandler(auth));

// API routes
app.use('/medicine', MedicineRouter);
app.use('/categories', CategoryRouter);
app.use('/orders', OrderRouter);
app.use('/reviews', ReviewRouter);
app.use('/admin', AdminRouter);

app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
});

export default app;

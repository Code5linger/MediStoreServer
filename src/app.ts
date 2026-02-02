import express, { type Application } from 'express';
import { MedicineRouter } from './modules/medicine/medicine.router';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import { CategoryRouter } from './modules/category/category.router';
import { OrderRouter } from './modules/order/order.router';

const app: Application = express();

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(
  cors!({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

app.use('/medicine', MedicineRouter);

app.use('/categories', CategoryRouter);

app.use('/orders', OrderRouter);

app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
});

export default app;

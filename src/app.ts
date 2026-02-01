import express, { type Application } from 'express';
import { PostRouter } from './modules/shop/shop.router';
import { MedicineRouter } from './modules/medicine/medicine.router';

const app: Application = express();

app.use(express.json());

// Create Posts
app.use('/shop', PostRouter);

app.use('/medicine', MedicineRouter);

app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
});

export default app;

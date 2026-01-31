import express, { type Application } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Hello World!');
  res.send('Hello World!');
});

// app.use('/posts', PostRouter);

export default app;

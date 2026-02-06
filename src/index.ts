import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

// Connect to database
prisma.$connect().then(() => {
  console.log('Connected to the database');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
}

// Export for Vercel
export default app;

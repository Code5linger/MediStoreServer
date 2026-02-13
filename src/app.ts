// import express, { type Application } from 'express';
// import { MedicineRouter } from './modules/medicine/medicine.router';
// import { toNodeHandler } from 'better-auth/node';
// import { auth } from './lib/auth';
// import cors from 'cors';
// import { CategoryRouter } from './modules/category/category.router';
// import { OrderRouter } from './modules/order/order.router';
// import { ReviewRouter } from './modules/review/review.router';
// import { AdminRouter } from './modules/admin/admin.router';

// const app: Application = express();

// app.use(express.json());

// // CORS configuration with multiple allowed origins
// const allowedOrigins = [
//   'https://medi-store-client-five.vercel.app',
//   process.env.APP_URL,
//   // Add your production frontend URL here when you deploy
//   // 'https://your-frontend.vercel.app',
// ].filter(Boolean); // Remove undefined values

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         console.log('Origin not allowed by CORS:', origin);
//         callback(null, true); // Allow for now, change to callback(new Error('Not allowed by CORS')) in production
//       }
//     },
//     credentials: true, // CRITICAL for cookies
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
//     exposedHeaders: ['Set-Cookie'],
//   }),
// );

// // Better Auth routes
// // app.all('/api/auth/*', toNodeHandler(auth));
// app.all('/api/auth/*splat', toNodeHandler(auth));

// // Temporary debug endpoint
// app.get('/debug/session', async (req, res) => {
//   try {
//     console.log('=== DEBUG SESSION ENDPOINT ===');
//     console.log('Headers:', req.headers);
//     console.log('Cookie:', req.headers.cookie);

//     const session = await auth.api.getSession({
//       headers: req.headers as any, // ← Fix: Cast to any
//     });

//     console.log('Session found:', !!session);
//     if (session) {
//       console.log('User:', session.user.email, 'Role:', session.user.role);
//     }

//     res.json({
//       hasSession: !!session,
//       session: session
//         ? {
//             userId: session.user.id,
//             email: session.user.email,
//             role: session.user.role,
//           }
//         : null,
//       cookieReceived: !!req.headers.cookie,
//       cookieValue: req.headers.cookie ? 'Present' : 'Missing',
//     });
//   } catch (error) {
//     console.error('Debug session error:', error);
//     res.status(500).json({ error: String(error) });
//   }
// });

// // API routes - Add /api prefix
// app.use('/medicine', MedicineRouter);
// app.use('/categories', CategoryRouter);
// app.use('/orders', OrderRouter);
// app.use('/reviews', ReviewRouter);
// app.use('/admin', AdminRouter);

// app.get('/', (req, res) => {
//   console.log('Hello World!');
//   res.send('Hello World!');
// });

// export default app;

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

// CORS configuration with multiple allowed origins
const allowedOrigins = [
  'https://medi-store-client-five.vercel.app',
  process.env.APP_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Origin not allowed by CORS:', origin);
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  }),
);

// Better Auth routes
app.all('/api/auth/*splat', toNodeHandler(auth));

// ✅ DEBUG ENDPOINT - Type fixed
app.get('/debug/session', async (req, res) => {
  try {
    console.log('=== DEBUG SESSION ENDPOINT ===');
    console.log('Headers:', req.headers);
    console.log('Cookie:', req.headers.cookie);

    const session = await auth.api.getSession({
      headers: req.headers as any, // ← Fix: Cast to any
    });

    console.log('Session found:', !!session);
    if (session) {
      console.log('User:', session.user.email, 'Role:', session.user.role);
    }

    res.json({
      hasSession: !!session,
      session: session
        ? {
            userId: session.user.id,
            email: session.user.email,
            role: session.user.role,
          }
        : null,
      cookieReceived: !!req.headers.cookie,
      cookieValue: req.headers.cookie ? 'Present' : 'Missing',
    });
  } catch (error) {
    console.error('Debug session error:', error);
    res.status(500).json({ error: String(error) });
  }
});

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

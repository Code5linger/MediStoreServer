import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  // Google
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: 'postgresql',
//   }),
//   trustedOrigins: [process.env.APP_URL!],
//   user: {
//     additionalFields: {
//       role: {
//         type: 'string',
//         defaultValue: 'CUSTOMER',
//         required: false,
//       },
//       phone: {
//         type: 'string',
//         required: false,
//       },
//       status: {
//         type: 'string',
//         defaultValue: 'ACTIVE',
//         required: false,
//       },
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     // autoSignIn: false,
//     autoSignIn: true,
//     // requireEmailVerification: true,
//     requireEmailVerification: false,
//   },
//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,
//     sendVerificationEmail: async ({ user, url, token }, request) => {
//       console.log(user, url, token);

//       try {
//         // console.log(user, url, token);
//         const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
//         const html = `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta charset="UTF-8" />
//                 <title>Email Verification</title>
//               </head>
//               <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
//                 <h2>Email Verification</h2>
//                 <p>Hi ${user.name || 'there'},</p>
//                 <p>
//                   Thank you for signing up. Please verify your email address by clicking the link below:
//                 </p>
//                 <p>
//                   <a href="${verificationUrl}">
//                     Verify Email
//                   </a>
//                 </p>
//                 <p>
//                   If you did not create this account, you can safely ignore this email.
//                 </p>
//                 <p>
//                   Thanks,<br />
//                   MEDISTORE Team
//                 </p>
//               </body>
//             </html>
// `;
//         const info = await transporter.sendMail({
//           from: '"PH-MODULE-24" <maddison53@ethereal.email>',
//           to: user.email,
//           subject: 'Verify your email',
//           html: html,
//           // HTML version of the message
//         });
//         console.log('Message sent: ', info.messageId);
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//     },
//   },
//   socialProviders: {
//     google: {
//       accessType: 'offline',
//       prompt: 'select_account consent',
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   // 🤖
//   session: {
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60, // 5 minutes
//     },
//   },
//   // advanced: {
//   //   cookiePrefix: 'medistore',
//   //   // useSecureCookies: process.env.NODE_ENV === 'production',
//   //   crossSubDomainCookies: {
//   //     enabled: false,
//   //   },
//   // },
//   advanced: {
//     cookiePrefix: 'medistore',
//     useSecureCookies: process.env.NODE_ENV === 'production',
//     crossSubDomainCookies: {
//       enabled: false,
//     },
//     // ADD THIS LINE:
//     cookieSameSite: 'lax', // Changed from 'none' since you're on localhost
//   },
// });

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: 'postgresql',
//   }),

//   // CRITICAL: Update this for production
//   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',

//   trustedOrigins: [
//     'http://localhost:3000',
//     'http://localhost:5000',
//     process.env.APP_URL || 'http://localhost:3000',
//     // Add your production frontend URL when deploying
//   ],

//   user: {
//     additionalFields: {
//       role: {
//         type: 'string',
//         defaultValue: 'CUSTOMER',
//         required: false,
//       },
//       phone: {
//         type: 'string',
//         required: false,
//       },
//       status: {
//         type: 'string',
//         defaultValue: 'ACTIVE',
//         required: false,
//       },
//     },
//   },

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//     requireEmailVerification: false,
//   },

//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,
//     sendVerificationEmail: async ({ user, url, token }, request) => {
//       // ... your email code ...
//     },
//   },

//   socialProviders: {
//     google: {
//       accessType: 'offline',
//       prompt: 'select_account consent',
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },

//   session: {
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60, // 5 minutes
//     },
//   },

//   // IMPORTANT: Cookie configuration for cross-origin
//   advanced: {
//     cookiePrefix: 'medistore',
//     useSecureCookies: process.env.NODE_ENV === 'production',
//     crossSubDomainCookies: {
//       enabled: false,
//     },
//     // CRITICAL: SameSite attribute for cookies
//     cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//   },
// });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // CRITICAL: Update this for production
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://medi-store-client-five.vercel.app',
    process.env.APP_URL || 'http://localhost:3000',
  ],

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'CUSTOMER',
        required: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(user, url, token);
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>Email Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
              <h2>Email Verification</h2>
              <p>Hi ${user.name || 'there'},</p>
              <p>
                Thank you for signing up. Please verify your email address by clicking the link below:
              </p>
              <p>
                <a href="${verificationUrl}">
                  Verify Email
                </a>
              </p>
              <p>
                If you did not create this account, you can safely ignore this email.
              </p>
              <p>
                Thanks,<br />
                MEDISTORE Team
              </p>
            </body>
          </html>
        `;
        const info = await transporter.sendMail({
          from: '"MEDISTORE" <noreply@medistore.com>',
          to: user.email,
          subject: 'Verify your email',
          html: html,
        });
        console.log('Message sent: ', info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      accessType: 'offline',
      prompt: 'select_account consent',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // ✅ SESSION CONFIGURATION - This is critical
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (session will be updated/extended)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // ✅ COOKIE CONFIGURATION
  advanced: {
    cookiePrefix: 'medistore',
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
    cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

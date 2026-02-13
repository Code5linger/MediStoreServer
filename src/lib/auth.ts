import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: ['https://medi-store-client-five.vercel.app'],

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
          html,
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

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: 'medistore',
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookieSameSite: 'none', // ✅ Must be 'none' for cross-domain
    crossSubDomainCookies: {
      enabled: true,
    },
  },
});

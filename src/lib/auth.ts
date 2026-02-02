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

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [process.env.APP_URL!],
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
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(user, url, token);

      try {
        // console.log(user, url, token);
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
          from: '"PH-MODULE-24" <maddison53@ethereal.email>',
          to: user.email,
          subject: 'Verify your email',
          html: html,
          // HTML version of the message
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
});

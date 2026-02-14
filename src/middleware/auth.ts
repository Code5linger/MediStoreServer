import { type NextFunction, type Request, type Response } from 'express';
import { auth as betterAuth } from '../lib/auth';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 🔍 DEBUG LOGGING (Remove after fixing)
      console.log('=== AUTH MIDDLEWARE DEBUG ===');
      console.log('Path:', req.path);
      console.log('Method:', req.method);
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      console.log('Cookie header:', req.headers.cookie);
      console.log('===========================');

      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      console.log('Session result:', session ? 'Found' : 'NOT FOUND');
      if (session) {
        console.log('User:', session.user.email, 'Role:', session.user.role);
      }

      if (!session) {
        console.log('❌ No session - returning 401');
        return res.status(401).json({
          success: false,
          message: 'You are not authorized!',
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as UserRole,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        console.log('❌ Wrong role - returning 403');
        console.log('Required:', roles, 'Got:', req.user.role);
        return res.status(403).json({
          success: false,
          message: 'Forbidden! O_o',
        });
      }

      console.log('✅ Auth passed');
      next();
    } catch (error) {
      console.error('❌ Auth error:', error);
      next(error);
    }
  };
};

export default auth;

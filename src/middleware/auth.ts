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
        // role: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.headers);

      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'You are not authorized!',
        });
      }

      if (!session.user.emailVerified) {
        return res.status(401).json({
          success: false,
          message: 'Email not verified!',
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        // role: session.user.role as string,
        role: session.user.role as UserRole,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden!',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

import { NextFunction, Request, Response } from 'express';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import { unauthorized } from '../utils/errors';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw unauthorized('Missing or invalid Authorization header');
    }

    const token = header.substring('Bearer '.length);
    const decoded = await auth.verifyIdToken(token);
    const user = await userService.ensureUserProfile({
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      role: user.role,
      token,
    };

    next();
  } catch (error) {
    next(unauthorized('Invalid authentication token'));
  }
};

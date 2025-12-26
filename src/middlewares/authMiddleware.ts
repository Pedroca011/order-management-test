import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils';
import HttpError from '../utils/httpError';

const auth = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new HttpError({
                title: 'unauthorized',
                detail: 'Authorization header missing',
                code: 401,
            });
        }
        const payload = validateToken(token) as { tokenType?: string; [key: string]: any };

        if (payload.tokenType !== 'access') {
            throw new HttpError({
                title: 'unauthorized',
                detail: 'Invalid Authorization header',
                code: 401,
            });
        }
        // Use type assertion to safely add tokenPayload to req object
        (req as Request & { tokenPayload?: typeof payload }).tokenPayload = payload;
        next();
    } catch (e: unknown) {
        // Properly narrow 'e' from unknown before accessing properties
        if (typeof e === 'object' && e !== null && 'opts' in e && (e as any).opts?.title === 'invalid_token') {
            next(
                new HttpError({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                })
            );
        } else {
            next(e);
        }
    }
};

export default auth;

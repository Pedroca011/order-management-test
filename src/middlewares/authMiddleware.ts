import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils";
import HttpError from "../utils/httpError";

const auth = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError({
        title: "unauthorized",
        detail: "Authorization header missing",
        code: 401,
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError({
        title: "unauthorized",
        detail: "Invalid Authorization header format",
        code: 401,
      });
    }

    const payload = validateToken(token) as {
      tokenType?: string;
      role?: string;
      [key: string]: any;
    };

    console.log("TOKEN PAYLOAD:", payload);

    if (payload.tokenType !== "access") {
      throw new HttpError({
        title: "unauthorized",
        detail: "Invalid token type",
        code: 401,
      });
    }

    (req as Request & { tokenPayload?: typeof payload }).tokenPayload = payload;
    next();
  } catch (e) {
    next(e);
  }
};

export default auth;

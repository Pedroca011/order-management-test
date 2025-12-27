import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { jsonOne } from "../utils/general";
import { authService } from "../services";
import { AuthInterface } from "../interfaces/authInterface";

/* =========================
   LOGIN
========================= */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AuthInterface | void> => {
  try {
    const { email, password } = matchedData(req, {
      includeOptionals: true,
      locations: ["body"],
    });

    const result = await authService.login(email, password);

    return jsonOne<AuthInterface>(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
};

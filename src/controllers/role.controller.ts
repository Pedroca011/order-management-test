import { NextFunction, Request, Response } from "express";
import { jsonAll } from "../utils/general";
import { roleService } from "../services";

/* =========================
   LIST ROLES
========================= */
const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await roleService.listRoles(page, limit);

    return jsonAll(res, 200, result.roles, result.meta);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRole,
};

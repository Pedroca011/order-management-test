import { Request, Response, NextFunction } from "express";
import { jsonOne, jsonAll } from "../utils/general";
import { userService } from "../services";
import { IUserModel } from "../models/user";

/* =========================
   CREATE
========================= */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    return jsonOne<IUserModel>(res, 201, user);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY ID
========================= */
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    return jsonOne(res, 200, user);
  } catch (error) {
    next(error);
  }
};

/* =========================
   LIST
========================= */
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.listUsers(page, limit);
    return jsonAll(res, 200, result.users, result.meta);
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getUser,
  getAllUser,
};

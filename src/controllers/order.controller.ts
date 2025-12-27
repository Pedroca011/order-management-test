import { Request, Response, NextFunction } from "express";
import { orderService } from "../services";
import { jsonAll, jsonOne } from "../utils/general";
import { IOrder } from "../interfaces";

/* =========================
   CREATE
========================= */
const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrder | void> => {
  try {
    const order = await orderService.createOrder(req.body);
    return jsonOne(res, 201, order);
  } catch (error) {
    next(error);
  }
};

/* =========================
   LIST
========================= */
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const state = req.query.state as string | undefined;

    const result = await orderService.listOrders({
      page,
      limit,
      state,
    });

    return jsonAll(res, 200, result.orders, result.meta);
  } catch (error) {
    next(error);
  }
};

/* =========================
   ADVANCE STATE
========================= */
const advanceOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await orderService.advanceOrderState(id);
    return jsonOne(res, 200, order);
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getOrders,
  advanceOrder,
};

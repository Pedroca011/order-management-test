import Order from "../models/order";
import { IOrder } from "../interfaces";
import HttpError from "../utils/httpError";
import { StateType } from "../utils/enums";

interface ListOrdersParams {
  page: number;
  limit: number;
  state?: string;
}

const ORDER_FLOW = [StateType.CREATED, StateType.ANALYSIS, StateType.COMPLETED] as const;

const createOrder = async (data: IOrder) => {
  const order = new Order({
    ...data,
    state: StateType.CREATED,
    status: "ACTIVE",
  });

  return await order.save();
};

const listOrders = async ({ page, limit, state }: ListOrdersParams) => {
  const filter: any = {};

  if (state) {
    filter.state = state;
  }

  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  return {
    orders,
    meta: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
};

const advanceOrderState = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new HttpError({
      title: "not_found",
      detail: "Order not found",
      code: 404,
    });
  }

  const currentIndex = ORDER_FLOW.indexOf(order.state);

  if (currentIndex === -1) {
    throw new HttpError({
      title: "invalid_state",
      detail: "Invalid order state",
      code: 422,
    });
  }

  if (order.state === StateType.COMPLETED) {
    throw new HttpError({
      title: "invalid_transition",
      detail: "Order already completed",
      code: 422,
    });
  }

  // Próximo estado válido
  order.state = ORDER_FLOW[currentIndex + 1] as StateType;
  await order.save();

  return order;
};

export default {
  createOrder,
  listOrders,
  advanceOrderState,
};

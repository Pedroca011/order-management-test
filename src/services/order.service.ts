import { IOrder } from "../interfaces";
import HttpError from "../utils/httpError";
import { StateType, StatusType, StatusServiceType } from "../utils/enums";
import { orderRepository } from "../repositories";

interface ListOrdersParams {
  page: number;
  limit: number;
  state?: string;
}

const ORDER_FLOW = [
  StateType.CREATED,
  StateType.ANALYSIS,
  StateType.COMPLETED,
] as const;

/* =========================
   CREATE
========================= */
const createOrder = async (data: IOrder) => {
  return await orderRepository.create({
    ...data,
    state: StateType.CREATED,
    status: StatusType.ACTIVE,
  });
};

/* =========================
   LIST
========================= */
const listOrders = async ({ page, limit, state }: ListOrdersParams) => {
  const filter: any = {};

  if (state) {
    filter.state = state;
  }

  const total = await orderRepository.count(filter);
  const orders = await orderRepository.findPaginated(filter, page, limit);

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

/* =========================
   ADVANCE STATE
========================= */
const advanceOrderState = async (orderId: string) => {
  const order = await orderRepository.findById(orderId);

  if (!order) {
    throw new HttpError({
      title: "not_found",
      detail: "Order not found",
      code: 404,
    });
  }

  const currentIndex = ORDER_FLOW.indexOf(
    order.state as typeof ORDER_FLOW[number]
  );

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

  const nextState = ORDER_FLOW[currentIndex + 1];
  
  if (!nextState) {
    throw new HttpError({
      title: "invalid_transition",
      detail: "Order is already in the final state",
      code: 422,
    });
  }

  order.state = nextState;

  // ✅ REGRA DE NEGÓCIO
  if (nextState === StateType.COMPLETED) {
    order.services = order.services.map(service => ({
      ...service,
      status: StatusServiceType.DONE,
    }));
  }

  return await orderRepository.update(order);
};


export default {
  createOrder,
  listOrders,
  advanceOrderState,
};
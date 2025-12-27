import Order from "../models/order";
import { IOrder } from "../interfaces";
import { StateType } from "../utils/enums";

interface ListOrdersFilter {
  state?: string;
}

const create = async (data: IOrder) => {
  return await Order.create(data);
};

const findById = async (id: string) => {
  return await Order.findById(id);
};

const count = async (filter: ListOrdersFilter) => {
  return await Order.countDocuments(filter);
};

const findPaginated = async (
  filter: ListOrdersFilter,
  page: number,
  limit: number
) => {
  return await Order.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
};

const update = async (order: any) => {
  return await order.save();
};

export const orderRepository = {
  create,
  findById,
  count,
  findPaginated,
  update,
};
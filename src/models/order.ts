import mongoose, { Document, Schema } from "mongoose";
import { IOrder } from "../interfaces";
import { ServiceSchema } from "./schemas/service.schema";

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IOrderModel extends IOrder, Document {}

//DEFINE ORDER SCHEMA
const OrderSchema: Schema = new Schema(
  {
    lab: {
      type: String,
      required: true,
      trim: true,
    },
    patient: {
      type: String,
      required: true,
      trim: true,
    },
    customer: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      enum: ["CREATED", "ANALYSIS", "COMPLETED"],
      default: "CREATED",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
      required: true,
    },
    services: {
      type: [ServiceSchema],
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message: "Order must have at least one service",
      },
    },
  },
  {
    timestamps: true,
  }
);

//EXPORT
export default mongoose.model<IOrderModel>("Order", OrderSchema);

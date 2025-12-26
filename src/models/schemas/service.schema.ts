import { Schema } from "mongoose";

//DEFINE AND EXPORT SERVICE SCHEMA
export const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
      required: true,
    },
  },
  {
    _id: false,
  }
);

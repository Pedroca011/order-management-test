import { body } from "express-validator";

export const createOrderValidation = [
  body("lab")
    .isString()
    .withMessage("lab must be a string")
    .notEmpty()
    .withMessage("lab is required"),

  body("patient")
    .isString()
    .withMessage("patient must be a string")
    .notEmpty()
    .withMessage("patient is required"),

  body("customer")
    .isString()
    .withMessage("customer must be a string")
    .notEmpty()
    .withMessage("customer is required"),

  body("services")
    .isArray({ min: 1 })
    .withMessage("services must be a non-empty array"),

  body("services.*.name")
    .isString()
    .withMessage("service name must be a string")
    .notEmpty()
    .withMessage("service name is required"),

  body("services.*.value")
    .isNumeric()
    .withMessage("service value must be a number")
    .custom((value) => value > 0)
    .withMessage("service value must be greater than 0"),

  body("services.*.status")
    .optional()
    .isIn(["PENDING", "DONE"])
    .withMessage("service status must be PENDING or DONE"),

  body("state")
    .optional()
    .isIn(["CREATED", "ANALYSIS", "COMPLETED"])
    .withMessage("state must be CREATED, ANALYSIS or COMPLETED"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "DELETED"])
    .withMessage("status must be ACTIVE or DELETED"),
];

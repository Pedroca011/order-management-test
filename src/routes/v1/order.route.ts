import { Router } from "express";
import validate from "../../middlewares/validationMiddleware";
import { createOrderValidation } from "../../validators/orderValidator";
import { orderController } from "../../controllers/order.controller";
import auth from "../../middlewares/authMiddleware";
import permit from "../../middlewares/permissionMiddleware";

//ORDER ROUTES //
const _router: Router = Router({
  mergeParams: true,
});

//CREATE ORDER
_router
  .route("/")
  .post(
    auth,
    permit(["admin"]),
    validate(createOrderValidation),
    orderController.createOrder
  );

// GET ORDERS
_router
  .route("/")
  .get(auth, permit(["admin", "user"]), orderController.getOrders);

//UPDATE ORDER
_router
  .route("/:id/advance")
  .patch(auth, permit(["admin"]), orderController.advanceOrder);

export const router = _router;

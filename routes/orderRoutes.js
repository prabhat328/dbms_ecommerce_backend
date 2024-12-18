import express from "express";
import {
    getAllOrders,
    getOrderById,
    deleteOrder
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrders);
router.get("/:order_id", verifyToken, getOrderById);
router.delete("/:order_id", verifyToken, deleteOrder);

export default router;

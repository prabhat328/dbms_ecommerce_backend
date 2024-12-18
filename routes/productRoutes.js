import express from "express";
import {
    getAllProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct,
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:product_id", getProductById);
router.post("/", verifyToken, addProduct);
router.delete("/:product_id", verifyToken, deleteProduct);
router.put("/:product_id", verifyToken, updateProduct);

export default router;

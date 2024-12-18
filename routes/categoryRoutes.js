import express from "express";
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCategories);
router.post("/", verifyToken, addCategory);
router.put("/:category_id", verifyToken, updateCategory);
router.delete("/:category_id", verifyToken, deleteCategory);

export default router;

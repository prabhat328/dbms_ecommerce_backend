import db from "../config/db.js";

// 1. Get all categories
export const getCategories = (req, res) => {
    const query = "SELECT * FROM Category";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Failed to fetch categories" });
        res.status(200).json(results);
    });
};

// 2. Add a new category
export const addCategory = (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const query = "INSERT INTO Category (category_name) VALUES (?)";
    db.query(query, [category_name], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Category already exists" });
            }
            return res.status(500).json({ message: "Failed to add category" });
        }
        res.status(201).json({ message: "Category added successfully" });
    });
};

// 3. Update a category
export const updateCategory = (req, res) => {
    const { category_id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const query = "UPDATE Category SET category_name = ? WHERE category_id = ?";
    db.query(query, [category_name, category_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to update category" });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category updated successfully" });
    });
};

// 4. Delete a category
export const deleteCategory = (req, res) => {
    const { category_id } = req.params;

    const query = "DELETE FROM Category WHERE category_id = ?";
    db.query(query, [category_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to delete category" });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    });
};

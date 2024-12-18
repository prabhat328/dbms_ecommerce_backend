import db from "../config/db.js";

// Get all products
export const getAllProducts = (req, res) => {
    const query = "SELECT * FROM Product";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Failed to fetch products" });
        res.status(200).json(results);
    });
};

// Get a single product by ID
export const getProductById = (req, res) => {
    const { product_id } = req.params;

    const query = "SELECT * FROM Product WHERE product_id = ?";
    db.query(query, [product_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to fetch product" });
        if (!result.length) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(result[0]);
    });
};

// Add a new product
export const addProduct = (req, res) => {
    const { product_name, price, size, stock, category_id } = req.body;

    const query = "INSERT INTO Product (product_name, price, size, stock, category_id) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [product_name, price, size, stock, category_id], (err) => {
        if (err) return res.status(500).json({ message: "Failed to add product" });
        res.json({ message: "Product added successfully" });
    });
};

// Remove a product
export const deleteProduct = (req, res) => {
    const { product_id } = req.params;

    const query = "DELETE FROM Product WHERE product_id = ?";
    db.query(query, [product_id], (err) => {
        if (err) return res.status(500).json({ message: "Failed to delete product" });
        res.json({ message: "Product deleted successfully" });
    });
};

// Update product
export const updateProduct = (req, res) => {
    const { product_id } = req.params;
    const { product_name, price, size, stock, category_id } = req.body;

    const query = "UPDATE Product SET product_name=?, price=?, size=?, stock=?, category_id=? WHERE product_id=?";
    db.query(query, [product_name, price, size, stock, category_id, product_id], (err) => {
        if (err) return res.status(500).json({ message: "Failed to update product" });
        res.json({ message: "Product updated successfully" });
    });
};

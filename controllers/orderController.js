import db from "../config/db.js";

// Get all orders
export const getAllOrders = (req, res) => {
    const query = `
      SELECT o.order_id, o.c_id, c.c_fname, c.c_lname, o.total_amount, o.order_date, o.status 
      FROM \`Order\` o
      JOIN Customer c ON o.c_id = c.c_id
      ORDER BY o.order_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Failed to fetch orders" });
        res.status(200).json(results);
    });
};

// Get a single order by ID (with products)
export const getOrderById = (req, res) => {
    const { order_id } = req.params;

    const query = `
      SELECT o.order_id, o.c_id, c.c_fname, c.c_lname, o.total_amount, o.order_date, o.status, 
             p.product_id, p.product_name, oi.quantity, oi.price
      FROM \`Order\` o
      JOIN Customer c ON o.c_id = c.c_id
      JOIN Order_Item oi ON o.order_id = oi.order_id
      JOIN Product p ON oi.product_id = p.product_id
      WHERE o.order_id = ?
    `;

    db.query(query, [order_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Failed to fetch order details" });
        if (!results.length) return res.status(404).json({ message: "Order not found" });

        const orderDetails = {
            order_id: results[0].order_id,
            customer: `${results[0].c_fname} ${results[0].c_lname}`,
            total_amount: results[0].total_amount,
            order_date: results[0].order_date,
            status: results[0].status,
            items: results.map((row) => ({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price,
            })),
        };

        res.status(200).json(orderDetails);
    });
};

// Remove an order
export const deleteOrder = (req, res) => {
    const { order_id } = req.params;

    const query = "DELETE FROM Orders WHERE order_id = ?";
    db.query(query, [order_id], (err) => {
        if (err) return res.status(500).json({ message: "Failed to delete order" });
        res.json({ message: "Order deleted successfully" });
    });
};

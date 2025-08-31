const db = require('../config/db');

const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING order_id',
            [req.user.user_id, totalPrice]
        );
        const createdOrder = orderResult.rows[0];

        for (const item of orderItems) {
            // In a real app, you would also update product stock here
            await db.query(
                'INSERT INTO order_items (order_id, product_id, name, quantity, price, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                [createdOrder.order_id, item.product_id, item.name, item.qty, item.price, item.image_url]
            );
        }

        // Note: In a real app, you'd save shippingAddress and paymentMethod to the order table as well.
        // For simplicity, we are not adding those columns to the DB in this project.
        
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.user_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderQuery = 'SELECT * FROM orders WHERE order_id = $1';
        const orderResult = await db.query(orderQuery, [req.params.id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Basic check to ensure the user requesting the order is the one who owns it
        if (orderResult.rows[0].user_id.toString() !== req.user.user_id.toString()) {
             return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        const order = orderResult.rows[0];

        const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';
        const itemsResult = await db.query(itemsQuery, [req.params.id]);
        order.orderItems = itemsResult.rows;

        // In a real app, you'd also fetch the user details (name, email)
        order.user = { name: req.user.name, email: req.user.email };

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { addOrderItems, getMyOrders, getOrderById };
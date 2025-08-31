const db = require('../config/db');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT user_id, name, email, is_admin FROM users ORDER BY created_at ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const userCountResult = await db.query('SELECT COUNT(*) FROM users');
        const orderCountResult = await db.query('SELECT COUNT(*) FROM orders');
        const totalRevenueResult = await db.query('SELECT SUM(total_price) FROM orders WHERE is_paid = true'); // Assuming is_paid functionality
        
        const stats = {
            userCount: userCountResult.rows[0].count,
            orderCount: orderCountResult.rows[0].count,
            totalRevenue: totalRevenueResult.rows[0].sum || 0,
        };

        res.json(stats);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' });
    }
}


module.exports = { getUsers, getDashboardStats };
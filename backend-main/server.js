const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // IMPORT ADMIN ROUTES

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.send('Main API is running...'); });

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes); // USE ADMIN ROUTES

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Main server running on port ${PORT}`));
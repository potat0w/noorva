const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Routes
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const orderItemsRouter = require('./routes/orderItems');

// Use routes
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/order-items', orderItemsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'E-commerce API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'https://noorva-bm65.vercel.app';
const allowedOrigins = [frontendUrl, 'http://localhost:3000'];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

const errorHandler = require('./middleware/errorHandler');

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const orderItemsRouter = require('./routes/orderItems');
const reviewsRouter = require('./routes/reviews');

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/order-items', orderItemsRouter);
app.use('/api/reviews', reviewsRouter);

app.get('/health', async (req, res) => {
  const payload = {
    status: 'OK',
    service: 'noorva-backend',
    message: 'E-commerce API is running',
    timestamp: new Date().toISOString(),
  };

  try {
    const supabase = require('./config/database');
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      return res.status(503).json({ ...payload, status: 'DEGRADED', database: 'unreachable' });
    }
    return res.status(200).json({ ...payload, database: 'ok' });
  } catch {
    return res.status(200).json(payload);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

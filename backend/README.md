# E-Commerce Backend API

Node.js and Express backend for an e-commerce website using Supabase as the database.

## Features

- **Products Management**: CRUD operations for products
- **User Authentication**: Registration, login with JWT tokens
- **Shopping Cart**: Add, update, remove cart items
- **Order Management**: Create orders, track order status
- **Order Items**: Manage individual order items
- **Error Handling**: Comprehensive error handling middleware
- **Authentication Middleware**: JWT-based authentication with role-based access

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Cart
- `GET /api/cart/user/:userId` - Get cart items for user
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/user/:userId` - Clear cart for user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/user/:userId` - Get orders by user ID
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Order Items
- `GET /api/order-items` - Get all order items
- `GET /api/order-items/order/:orderId` - Get order items by order ID
- `GET /api/order-items/:id` - Get order item by ID
- `POST /api/order-items` - Create order item
- `PUT /api/order-items/:id` - Update order item
- `DELETE /api/order-items/:id` - Delete order item
- `DELETE /api/order-items/order/:orderId` - Delete all order items for order

### Health Check
- `GET /health` - API health check

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Database Schema

The API uses the following tables:

- **users**: id, name, email, password_hash, role, created_at
- **products**: id, title, description, price, image_url, stock, created_at
- **cart_items**: id, user_id, product_id, quantity
- **orders**: id, user_id, total_price, status, created_at, full_name, phone, address, city, postal_code
- **order_items**: id, order_id, product_id, quantity, price

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API includes comprehensive error handling for:
- Database errors (Supabase)
- Authentication errors (JWT)
- Validation errors
- Syntax errors (invalid JSON)

## Dependencies

- express: Web framework
- cors: Cross-origin resource sharing
- dotenv: Environment variable management
- @supabase/supabase-js: Supabase client
- bcryptjs: Password hashing
- jsonwebtoken: JWT token management
- nodemon: Development server (dev dependency)

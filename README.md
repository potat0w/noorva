# E-Commerce Website

Full-stack e-commerce website with Node.js/Express backend and Next.js frontend using Supabase as the database.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # Next.js frontend application
├── .env             # Environment variables
└── README.md        # This file
```

## Backend

See [backend/README.md](./backend/README.md) for detailed API documentation.

### Setup
```bash
cd backend
npm install
npm run dev
```

The backend server runs on port 5000.

## Frontend

### Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs on port 3000.

## Environment Variables

The `.env` file contains configuration for both frontend and backend:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Features

- **Product Management**: Browse, search, and filter products
- **User Authentication**: Register, login, and user profiles
- **Shopping Cart**: Add items to cart and manage quantities
- **Order Management**: Place orders and track order status
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL database)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Radix UI components
- Framer Motion animations

## Getting Started

1. Clone the repository
2. Set up your Supabase project and update `.env` file
3. Install dependencies for both backend and frontend
4. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```
5. Open http://localhost:3000 in your browser

## API Documentation

The backend API provides RESTful endpoints for:
- Products (`/api/products`)
- Users (`/api/users`)
- Cart (`/api/cart`)
- Orders (`/api/orders`)
- Order Items (`/api/order-items`)

See [backend/README.md](./backend/README.md) for complete API documentation.

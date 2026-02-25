# 🛍️ Shopora — Full-Stack E-Commerce Platform

A production-ready e-commerce website built with **React + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🏗️ Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React 18, React Router v6, Tailwind CSS 3 |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB + Mongoose                   |
| Auth      | JWT (JSON Web Tokens)                |
| Styling   | Tailwind CSS, Custom dark theme      |
| State     | React Context API                    |

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt hashing
│   │   ├── Product.js       # Product schema with reviews
│   │   └── Order.js         # Order schema with status tracking
│   ├── routes/
│   │   ├── auth.js          # Register, login, profile
│   │   ├── products.js      # CRUD + search + reviews
│   │   ├── orders.js        # Place orders + order management
│   │   ├── cart.js          # Cart validation endpoint
│   │   └── users.js         # Admin user management
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly middleware
│   ├── server.js            # Express app + MongoDB connection
│   ├── seed.js              # Database seeder with sample data
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx   # User auth state
    │   │   └── CartContext.jsx   # Shopping cart state (localStorage)
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation with search + cart
    │   │   ├── ProductCard.jsx   # Product card with quick-add
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx      # Hero, categories, featured
    │   │   ├── ProductsPage.jsx  # Listing with filters + search
    │   │   ├── ProductDetailPage.jsx # Detail + reviews
    │   │   ├── CartPage.jsx      # Shopping cart
    │   │   ├── CheckoutPage.jsx  # 3-step checkout wizard
    │   │   ├── AuthPages.jsx     # Login + Register
    │   │   ├── OrderPages.jsx    # My orders + order detail
    │   │   ├── ProfilePage.jsx   # User profile + password change
    │   │   └── AdminPage.jsx     # Admin dashboard
    │   ├── api.js               # Axios instance + all API calls
    │   ├── App.jsx              # Routes + providers
    │   ├── index.js             # Entry point
    │   └── index.css            # Tailwind + custom styles
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=your_super_secret_key_here
# PORT=5000

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

The API will run on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will run on `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@shopify.com      | Admin@1234  |
| User  | john@example.com       | User@1234   |

---

## 🌟 Features

### 🛒 Shopping
- Product listing with grid layout
- Advanced filters (category, price range, rating)
- Full-text search across name, description, tags
- Product detail with image gallery
- Customer reviews and ratings
- Real-time cart with quantity management
- Persistent cart (localStorage)

### 🔐 Authentication
- JWT-based authentication
- Register / Login
- Protected routes
- Password change
- Profile management with address

### 📦 Orders
- 3-step checkout (Shipping → Payment → Review)
- Multiple payment methods
- Order history
- Order detail with status tracking
- Auto stock deduction on order placement
- Free shipping on orders over $50

### 🔧 Admin Dashboard
- Revenue and stats overview
- Product management (view, delete)
- Order management with status updates
- User management

---

## 📡 API Endpoints

### Auth
| Method | Route                    | Description          |
|--------|--------------------------|----------------------|
| POST   | /api/auth/register       | Register new user    |
| POST   | /api/auth/login          | Login                |
| GET    | /api/auth/me             | Get current user     |
| PUT    | /api/auth/profile        | Update profile       |
| PUT    | /api/auth/change-password | Change password     |

### Products
| Method | Route                       | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/products               | List products (+ filters)|
| GET    | /api/products/:id           | Get product by ID        |
| POST   | /api/products               | Create product (admin)   |
| PUT    | /api/products/:id           | Update product (admin)   |
| DELETE | /api/products/:id           | Delete product (admin)   |
| POST   | /api/products/:id/reviews   | Add review (auth)        |

### Orders
| Method | Route                  | Description             |
|--------|------------------------|-------------------------|
| POST   | /api/orders            | Create order (auth)     |
| GET    | /api/orders/my         | My orders (auth)        |
| GET    | /api/orders/:id        | Order detail (auth)     |
| GET    | /api/orders            | All orders (admin)      |
| PUT    | /api/orders/:id/status | Update status (admin)   |

---

## 🎨 Design System

- **Theme**: Dark luxury with purple brand accent
- **Fonts**: Playfair Display (display) + DM Sans (body)
- **Colors**: Custom ink/surface/brand palette
- **Components**: Cards, Buttons, Inputs, Badges, Skeletons
- **Animations**: Fade-in, slide-up, shimmer loading

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Production Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables in your hosting platform
2. Use MongoDB Atlas for the database
3. `npm start`

### Frontend (e.g., Vercel, Netlify)
1. Set `REACT_APP_API_URL` to your backend URL
2. `npm run build`
3. Deploy the `build` folder

---

## 📝 License

MIT License — Free to use for personal and commercial projects.

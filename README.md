# MAISON — Fashion E-Commerce (Full Stack)

## Tech Stack
- **Frontend**: React + React Router + Context API
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT + bcrypt

---

## Project Structure
```
maison/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── seed.js         # Sample data seeder
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Reusable UI
│       ├── context/    # Global state
│       ├── pages/      # Route pages
│       ├── services/   # API calls
│       └── App.jsx
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+): https://nodejs.org
- MongoDB: https://www.mongodb.com/try/download/community
  OR use free cloud: https://cloud.mongodb.com (MongoDB Atlas)

---

### Step 1 — Install dependencies

Open TWO terminals in VS Code.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
```

---

### Step 2 — Configure environment

In `backend/`, create a `.env` file (already provided as `.env.example`):
```
cp .env.example .env
```
Then edit `.env` with your MongoDB URI.

**If using local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/maison
```

**If using MongoDB Atlas (cloud):**
1. Go to https://cloud.mongodb.com
2. Create free cluster → Connect → Drivers → copy the URI
3. Replace `<password>` with your password

---

### Step 3 — Seed the database

```bash
cd backend
node seed.js
```
This adds sample products, an admin user, and a test user.

**Admin login:** admin@maison.com / admin123  
**Test user:** user@maison.com / user123

---

### Step 4 — Run the project

**Terminal 1 — Backend (runs on port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (runs on port 3000):**
```bash
cd frontend
npm start
```

Open http://localhost:3000 in your browser.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | All products |
| GET | /api/products/:id | Single product |
| POST | /api/products | Add product (admin) |
| PUT | /api/products/:id | Edit product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:id | Update quantity |
| DELETE | /api/cart/:id | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/my | My orders |
| GET | /api/orders | All orders (admin) |
| PUT | /api/orders/:id | Update status (admin) |

# Apple Lounge Zimbabwe

Premium e-commerce website for Apple Lounge Zimbabwe — your destination for brand-new iPhones and Apple products in Victoria Falls, Zimbabwe.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18
- Framer Motion
- Lucide React

**Backend:**
- Node.js + Express.js
- MySQL (mysql2)
- JWT authentication
- bcryptjs password hashing
- express-validator
- multer (image uploads)
- Cloudinary (optional)

## Project Structure

```
apple-lounge/
├── frontend/                 # Next.js frontend
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Product listing & detail
│   │   ├── accessories/      # Accessories page
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout & success
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   ├── admin/            # Admin dashboard
│   │   ├── privacy/          # Privacy policy
│   │   ├── terms/            # Terms of service
│   │   ├── sitemap.ts        # Dynamic sitemap
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── loading.tsx       # Loading state
│   │   └── not-found.tsx     # 404 page
│   ├── components/           # Reusable React components
│   ├── context/              # React Context (Cart, Auth)
│   ├── lib/                  # API client, utilities
│   ├── types/                # TypeScript types
│   ├── hooks/                # Custom React hooks
│   ├── public/               # Static assets
│   ├── .env.local            # Frontend env vars
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                  # Express.js API
    ├── controllers/          # Route handlers
    ├── routes/               # Express routes
    ├── middleware/            # Auth, validation, error handling
    ├── config/               # Database config
    ├── database/             # SQL schema & seed files
    ├── utils/                # Helper functions
    ├── uploads/              # Uploaded images
    ├── server.js             # Entry point
    ├── .env                  # Backend env vars
    └── package.json
```

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

## Installation

### 1. Clone & Install

```bash
# Install backend dependencies
cd apple-lounge/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. MySQL Setup

```sql
CREATE DATABASE apple_lounge;
```

### 3. Environment Variables

**Backend** (`backend/.env`):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=apple_lounge

JWT_SECRET=your_jwt_secret_here

FRONTEND_URL=http://localhost:3000

# Optional: Cloudinary for image uploads
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=263771234567
```

### 4. Database Migration

```bash
cd backend
mysql -u root -p apple_lounge < database/schema.sql
```

### 5. Seed Data

```bash
cd backend
mysql -u root -p apple_lounge < database/seed.sql
```

### 6. Create Admin Account

Register through the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@apparelounge.co.zw","phone":"+263771234567","password":"admin123"}'
```

Then update the role to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@apparelounge.co.zw';
```

### 7. Run Development Servers

**Backend** (Terminal 1):
```bash
cd apple-lounge/backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd apple-lounge/frontend
npm run dev
```

The frontend will be available at **http://localhost:3000** and the API at **http://localhost:5000**.

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports filters) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/models` | Get all models |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

**Product Filters:** `?model=iPhone+17&category=iphones&featured=true&sort=price_asc&search=pro&minPrice=500&maxPrice=1000`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (authenticated) |
| POST | `/api/auth/logout` | Logout |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (public) |
| GET | `/api/orders` | List all orders (admin) |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Dashboard stats (admin) |
| POST | `/api/upload` | Upload image (admin) |
| GET | `/api/health` | Health check |

## Admin Dashboard

Access at **http://localhost:3000/admin**

Features:
- Dashboard overview (total products, orders, pending orders, sales)
- Product management (add, edit, delete, toggle featured)
- Image upload (local or Cloudinary)
- Order management (update status and payment status)
- Real-time stats

## Features

- Premium Apple-inspired design
- Responsive (mobile-first)
- Product catalogue with filtering and search
- Shopping cart with localStorage persistence
- Checkout with pickup/delivery options
- WhatsApp ordering integration
- Admin dashboard with product & order management
- SEO optimized (sitemap, meta tags, structured data)
- Smooth animations (Framer Motion)
- Error handling & loading states

## WhatsApp Integration

Products include "WhatsApp Us" buttons that open WhatsApp with a pre-filled message containing product details. Configure the phone number via `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable.

## Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Render/DigitalOcean)
1. Set up MySQL database
2. Configure environment variables
3. Run `npm start`
4. Set up reverse proxy (nginx) for production

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure `FRONTEND_URL` to your production domain
- Set up Cloudinary for image uploads

## License

All rights reserved. Apple Lounge Zimbabwe.

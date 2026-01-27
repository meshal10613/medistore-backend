# MediStore Backend 💊

**MediStore Backend** is the REST API for the MediStore e-commerce platform — an online medicine shop where customers can purchase medicines, sellers manage inventory, and admins oversee the entire system.

---

## 🚀 Features

- Role-based access control (**Admin | Seller | Customer**)
- JWT-based authentication
- Medicine, category, order, and review management
- Secure user profile updates with role restrictions
- Admin & seller dashboard statistics
- Clean RESTful API design

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **Better-Auth**
- **dotenv**
- **CORS**

---

## 👥 User Roles & Permissions

| Role         | Capabilities                                                         |
| ------------ | -------------------------------------------------------------------- |
| **Admin**    | Manage users, view all orders, manage categories, access admin stats |
| **Seller**   | Manage medicines, view & manage orders, access seller stats          |
| **Customer** | Browse medicines, place orders, write reviews                        |

---

## 🔐 Authentication Routes

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login user                     |
| GET    | `/api/user/me`       | Get current authenticated user |

---

## 👤 User Routes

| Method | Endpoint                 | Access                    | Description                |
| ------ | ------------------------ | ------------------------- | -------------------------- |
| GET    | `/api/user`              | Admin                     | Get all users              |
| GET    | `/api/user/admin/stats`  | Admin                     | Get admin dashboard stats  |
| GET    | `/api/user/seller/stats` | Seller                    | Get seller dashboard stats |
| PATCH  | `/api/user/:id`          | Admin / Seller / Customer | Update user profile        |

### 🔎 Update Rules

- **Admin:** Can update own data, and change role/status of sellers & customers
- **Seller & Customer:** Can update only name and image

---

## 📦 Category Routes

| Method | Endpoint        | Access         | Description        |
| ------ | --------------- | -------------- | ------------------ |
| GET    | `/api/category` | Public         | Get all categories |
| POST   | `/api/category` | Admin / Seller | Create a category  |

---

## 💊 Medicine Routes

| Method | Endpoint            | Access | Description        |
| ------ | ------------------- | ------ | ------------------ |
| GET    | `/api/medicine`     | Public | Get all medicines  |
| GET    | `/api/medicine/:id` | Public | Get medicine by ID |
| POST   | `/api/medicine`     | Seller | Create a medicine  |
| PATCH  | `/api/medicine/:id` | Seller | Update medicine    |
| DELETE | `/api/medicine/:id` | Seller | Delete medicine    |

### ✏️ Editable Fields (Seller)

- Name
- Description
- Price
- Stock
- Manufacturer
- Image URL

---

## 🛒 Order Routes

| Method | Endpoint         | Access                    | Description     |
| ------ | ---------------- | ------------------------- | --------------- |
| GET    | `/api/order`     | Admin / Seller            | Get all orders  |
| GET    | `/api/order/:id` | Admin / Seller            | Get order by ID |
| POST   | `/api/order`     | Admin / Seller / Customer | Create order    |
| PATCH  | `/api/order/:id` | Admin / Seller            | Update order    |
| DELETE | `/api/order/:id` | Admin / Seller            | Delete order    |

---

## ⭐ Review Routes

| Method | Endpoint          | Access    | Description         |
| ------ | ----------------- | --------- | ------------------- |
| GET    | `/api/review`     | All roles | Get all reviews     |
| GET    | `/api/review/:id` | All roles | Get reviews by user |
| POST   | `/api/review`     | All roles | Create review       |
| PATCH  | `/api/review/:id` | All roles | Update review       |
| DELETE | `/api/review/:id` | All roles | Delete review       |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=your_port_number
DATABASE_URL=your_database_url

BETTER_AUTH_SECRET=better_auth_secret
BETTER_AUTH_URL= # Base URL of your app
APP_URL= # URL of your frontend app

GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=12345678
```

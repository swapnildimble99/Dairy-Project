# Dairy Management System - MCA Academic Project

##   Important   ######
Node.Js Required For Working This Project

## 1. System Architecture
The Dairy Management System uses a modern, scalable full-stack architecture:
- **Frontend**: React 19, Vite, Tailwind CSS, and React Router. It serves two distinct interfaces from a single application:
  1. **Internal Dairy Management Dashboard** (Staff)
  2. **Customer Ordering Website** (Online Shop)
- **Backend**: Node.js with Express.js providing RESTful API services.
- **Database**: SQLite (using `better-sqlite3` for fast, synchronous, and reliable queries).
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing. Role-based access control (RBAC) is enforced at the API route level.
- **Deployment**: Single-container deployment where Express serves both the API and the built React static files.

## 2. SQLite Database Schema
The database consists of the following core tables to meet all requirements:
- **Roles**: `id`, `roleName`
- **Users**: `id`, `name`, `email`, `password`, `roleId`, `createdAt`
- **Farmers**: `id`, `name`, `phone`, `address`, `village`, `isActive`, `createdAt`
- **MilkCollection**: `id`, `farmerId`, `quantity`, `quality`, `verifiedBy`, `createdAt`
- **Products**: `id`, `name`, `price`, `description`
- **Production**: `id`, `productId`, `milkUsed`, `quantityProduced`, `workerId`, `createdAt`
- **Inventory**: `id`, `productId`, `quantity`, `lastUpdated`
- **Customers**: `id`, `userId`, `phone`, `address`, `createdAt`
- **Orders**: `id`, `customerId`, `totalAmount`, `paymentMethod`, `status`, `createdAt`
- **OrderItems**: `id`, `orderId`, `productId`, `quantity`, `price`
- **Deliveries**: `id`, `orderId`, `workerId`, `status`, `updatedAt`
- **Reports**: `id`, `reportName`, `generatedBy`, `generatedAt`, `dataSnapshot`

## 4. API Endpoints
**Auth & Users**
- `POST /api/auth/login`: Authenticate user and return JWT.
- `POST /api/auth/register`: Register a new customer.
- `GET /api/users`: List all users (Admin only).

**Farmers & Milk Collection**
- `GET /api/farmers` | `POST /api/farmers`: Manage farmers.
- `GET /api/milk-collection` | `POST /api/milk-collection`: Record and verify milk.

**Production & Inventory**
- `GET /api/products`: List available products and prices.
- `GET /api/production` | `POST /api/production`: Manage dairy production.
- `GET /api/inventory`: View real-time stock levels.

**Orders & Deliveries**
- `POST /api/orders`: Place a new order (Customer/Counter Staff).
- `GET /api/orders`: View orders (filtered by role).
- `PUT /api/orders/:id/status`: Update order status.
- `GET /api/deliveries` | `POST /api/deliveries`: Manage deliveries.

Credentials Of Admin Login :-
Username :-admin@dairy.com
Password :-admin123



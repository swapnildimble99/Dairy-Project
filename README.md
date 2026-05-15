# Dairy Management System - MCA Academic Project

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

## 3. ER Diagram Explanation
- **Roles & Users**: A 1-to-Many relationship. Each user has one role (Admin, Supervisor, Customer, etc.).
- **Users & Operations**: Users have 1-to-Many relationships with **MilkCollection** (Supervisor verifying), **Production** (Worker producing), and **Deliveries** (Delivery Worker assigned).
- **Farmers & MilkCollection**: A 1-to-Many relationship. One farmer can have many daily milk collection records.
- **Products & Inventory/Production**: **Products** has a 1-to-1 relationship with **Inventory** and a 1-to-Many relationship with **Production** and **OrderItems**.
- **Customers & Orders**: A 1-to-Many relationship. A customer can place multiple orders.
- **Orders & OrderItems**: A 1-to-Many relationship. One order contains multiple items.
- **Orders & Deliveries**: A 1-to-1 relationship. An order has one delivery record.

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

**Reports**
- `GET /api/reports/daily-milk`: Get daily milk collection stats.
- `GET /api/reports/sales`: Get sales analytics.

## 5. Project Folder Structure
```text
/
├── server.ts                 # Express backend entry point & API Routes
├── build-server.ts           # Esbuild script for backend compilation
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main React component & Routing (Split interfaces)
│   ├── index.css             # Tailwind CSS global styles
│   ├── lib/
│   │   └── api.ts            # API utility functions (fetch wrapper)
│   ├── components/
│   │   └── DashboardLayout.tsx # Shared layout for internal staff
│   ├── pages/
│   │   ├── Landing.tsx       # Entry point choosing Shop vs Staff Login
│   │   ├── Shop/             # Customer Ordering Website Interface
│   │   │   ├── ShopHome.tsx
│   │   │   └── CustomerOrders.tsx
│   │   ├── Staff/            # Internal Dairy Management Interface
│   │   │   ├── Login.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── SupervisorDashboard.tsx
│   │   │   ├── CounterDashboard.tsx
│   │   │   ├── ProductionDashboard.tsx
│   │   │   └── DeliveryDashboard.tsx
│   └── server/
│       └── db.ts             # SQLite database schema and initialization
```

## 6. Example Backend Code
```typescript
// Example: Role-based protected route for Production (server.ts)
app.post('/api/production', authenticate, requireRole(['Production Worker']), (req, res) => {
  const { productId, milkUsed, quantityProduced } = req.body;
  
  const transaction = db.transaction(() => {
    // 1. Deduct raw milk
    db.prepare('UPDATE Inventory SET quantity = quantity - ? WHERE productId = (SELECT id FROM Products WHERE name = "Milk")').run(milkUsed);
    // 2. Add finished product
    db.prepare('UPDATE Inventory SET quantity = quantity + ? WHERE productId = ?').run(quantityProduced, productId);
    // 3. Record production log
    const info = db.prepare('INSERT INTO Production (productId, milkUsed, quantityProduced, workerId) VALUES (?, ?, ?, ?)').run(productId, milkUsed, quantityProduced, req.user.id);
    return info.lastInsertRowid;
  });

  try {
    const id = transaction();
    res.json({ success: true, id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
```

## 7. Example Frontend Code
```tsx
// Example: Customer Shop Interface (React)
export default function ShopHome() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchApi('/products').then(setProducts);
  }, []);

  const handleBuy = async (productId, price) => {
    await fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify({ items: [{ productId, quantity: 1, price }] })
    });
    alert('Order placed successfully!');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">DairyShop Online</h1>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-xl">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            <button onClick={() => handleBuy(p.id, p.price)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 8. Reporting SQL Queries
**1. Daily Milk Collection Report:**
```sql
SELECT DATE(createdAt) as collection_date, SUM(quantity) as total_liters
FROM MilkCollection
GROUP BY DATE(createdAt)
ORDER BY collection_date DESC;
```

**2. Farmer-Wise Milk Supply (Current Month):**
```sql
SELECT f.name, f.farmerId, SUM(m.quantity) as total_supplied
FROM MilkCollection m
JOIN Farmers f ON m.farmerId = f.id
WHERE strftime('%Y-%m', m.createdAt) = strftime('%Y-%m', 'now')
GROUP BY f.id;
```

**3. Product-Wise Production Report:**
```sql
SELECT p.name as product_name, SUM(pr.quantityProduced) as total_produced, SUM(pr.milkUsed) as total_milk_consumed
FROM Production pr
JOIN Products p ON pr.productId = p.id
GROUP BY p.id;
```

**4. Sales & Revenue Report:**
```sql
SELECT DATE(createdAt) as sale_date, COUNT(id) as total_orders, SUM(totalAmount) as revenue
FROM Orders
WHERE status != 'Cancelled'
GROUP BY DATE(createdAt);
```

## 9. Future Improvements
1. **IoT Integration**: Integrate automated milk testing machines (Fat/SNF analyzers) to directly push quality data to the database.
2. **Payment Gateway**: Integrate Stripe or Razorpay for seamless online payments on the Customer Ordering Website.
3. **Real-time GPS Tracking**: Add live tracking for Delivery Workers using WebSockets and Google Maps API.
4. **Mobile Application**: Develop a React Native mobile app for Farmers to check their daily supply and payments, and for Delivery Workers to update statuses on the go.
5. **AI Demand Forecasting**: Use machine learning to predict product demand based on historical sales and seasonal trends to optimize production.

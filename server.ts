import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/server/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dairy-key-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare(`
      SELECT u.*, r.roleName 
      FROM Users u 
      JOIN Roles r ON u.roleId = r.id 
      WHERE u.email = ?
    `).get(email) as any;
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, roleName: user.roleName, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.roleName } });
  });

  app.post('/api/auth/register-customer', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      const customerRole = db.prepare('SELECT id FROM Roles WHERE roleName = ?').get('Customer') as any;
      
      const transaction = db.transaction(() => {
        const userInfo = db.prepare('INSERT INTO Users (name, email, password, roleId) VALUES (?, ?, ?, ?)').run(name, email, hash, customerRole.id);
        const userId = userInfo.lastInsertRowid;
        db.prepare('INSERT INTO Customers (userId, phone, address) VALUES (?, ?, ?)').run(userId, phone, address);
        return userId;
      });
      
      const userId = transaction();
      const token = jwt.sign({ id: userId, roleName: 'Customer', name }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: userId, name, email, role: 'Customer' } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, r.roleName as role, c.phone, c.address
      FROM Users u 
      JOIN Roles r ON u.roleId = r.id 
      LEFT JOIN Customers c ON u.id = c.userId
      WHERE u.id = ?
    `).get(req.user.id);
    res.json(user);
  });

  app.put('/api/users/profile', authenticate, (req: any, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
      const transaction = db.transaction(() => {
        if (password) {
          const hash = bcrypt.hashSync(password, 10);
          db.prepare('UPDATE Users SET name = ?, email = ?, password = ? WHERE id = ?').run(name, email, hash, req.user.id);
        } else {
          db.prepare('UPDATE Users SET name = ?, email = ? WHERE id = ?').run(name, email, req.user.id);
        }

        if (req.user.roleName === 'Customer') {
          db.prepare('UPDATE Customers SET phone = ?, address = ? WHERE userId = ?').run(phone, address, req.user.id);
        }
      });
      transaction();

      const updatedUser = db.prepare(`
        SELECT u.id, u.name, u.email, r.roleName as role, c.phone, c.address
        FROM Users u 
        JOIN Roles r ON u.roleId = r.id 
        LEFT JOIN Customers c ON u.id = c.userId
        WHERE u.id = ?
      `).get(req.user.id);
      
      res.json({ success: true, user: updatedUser });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Users (Admin only)
  app.get('/api/users', authenticate, requireRole(['Admin']), (req, res) => {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, r.roleName as role, u.createdAt 
      FROM Users u 
      JOIN Roles r ON u.roleId = r.id
    `).all();
    res.json(users);
  });

  app.post('/api/users', authenticate, requireRole(['Admin']), (req, res) => {
    const { name, email, password, roleName } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      const role = db.prepare('SELECT id FROM Roles WHERE roleName = ?').get(roleName) as any;
      if (!role) return res.status(400).json({ error: 'Invalid role' });
      
      const info = db.prepare('INSERT INTO Users (name, email, password, roleId) VALUES (?, ?, ?, ?)').run(name, email, hash, role.id);
      res.json({ id: info.lastInsertRowid, name, email, role: roleName });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/users/:id', authenticate, requireRole(['Admin']), (req, res) => {
    const { name, email, roleName } = req.body;
    const { id } = req.params;
    try {
      const role = db.prepare('SELECT id FROM Roles WHERE roleName = ?').get(roleName) as any;
      if (!role) return res.status(400).json({ error: 'Invalid role' });
      
      db.prepare('UPDATE Users SET name = ?, email = ?, roleId = ? WHERE id = ?').run(name, email, role.id, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/users/:id', authenticate, requireRole(['Admin']), (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM Users WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Products
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM Products').all();
    res.json(products);
  });

  // Farmers (Admin, Supervisor)
  app.get('/api/farmers', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const farmers = db.prepare('SELECT * FROM Farmers').all();
    res.json(farmers);
  });

  app.post('/api/farmers', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const { name, phone, address, village } = req.body;
    const info = db.prepare('INSERT INTO Farmers (name, phone, address, village) VALUES (?, ?, ?, ?)').run(name, phone, address, village);
    res.json({ id: info.lastInsertRowid, name, phone, address, village, isActive: 1 });
  });

  app.put('/api/farmers/:id', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const { id } = req.params;
    const { name, phone, address, village } = req.body;
    try {
      db.prepare('UPDATE Farmers SET name = ?, phone = ?, address = ?, village = ? WHERE id = ?').run(name, phone, address, village, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/farmers/:id', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM Farmers WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Milk Collection
  app.get('/api/milk-collection', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const records = db.prepare(`
      SELECT m.*, f.name as farmerName, u.name as verifiedByName 
      FROM MilkCollection m 
      JOIN Farmers f ON m.farmerId = f.id 
      LEFT JOIN Users u ON m.verifiedBy = u.id
      ORDER BY m.createdAt DESC
    `).all();
    res.json(records);
  });

  app.post('/api/milk-collection', authenticate, requireRole(['Admin', 'Supervisor']), (req: any, res) => {
    const { farmerId, quantity, quality } = req.body;
    
    const transaction = db.transaction(() => {
      const info = db.prepare('INSERT INTO MilkCollection (farmerId, quantity, quality, verifiedBy) VALUES (?, ?, ?, ?)').run(farmerId, quantity, quality, req.user.id);
      // Update raw milk inventory
      db.prepare("UPDATE Inventory SET quantity = quantity + ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = (SELECT id FROM Products WHERE name = 'Milk')").run(quantity);
      return info.lastInsertRowid;
    });

    try {
      const id = transaction();
      res.json({ id, farmerId, quantity, quality, verifiedBy: req.user.id });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/milk-collection/:id', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const { id } = req.params;
    try {
      const record = db.prepare('SELECT quantity FROM MilkCollection WHERE id = ?').get() as any;
      if (record) {
        db.transaction(() => {
          db.prepare("UPDATE Inventory SET quantity = quantity - ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = (SELECT id FROM Products WHERE name = 'Milk')").run(record.quantity);
          db.prepare('DELETE FROM MilkCollection WHERE id = ?').run(id);
        })();
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Production
  app.get('/api/production', authenticate, requireRole(['Admin', 'Supervisor', 'Dairy Production Worker']), (req, res) => {
    const records = db.prepare(`
      SELECT p.*, prod.name as productName, u.name as workerName 
      FROM Production p 
      JOIN Products prod ON p.productId = prod.id
      JOIN Users u ON p.workerId = u.id
      ORDER BY p.createdAt DESC
    `).all();
    res.json(records);
  });

  app.post('/api/production', authenticate, requireRole(['Admin', 'Dairy Production Worker']), (req: any, res) => {
    const { productId, milkUsed, quantityProduced } = req.body;
    
    const milkInv = db.prepare("SELECT quantity FROM Inventory WHERE productId = (SELECT id FROM Products WHERE name = 'Milk')").get() as any;
    if (!milkInv || milkInv.quantity < milkUsed) {
      return res.status(400).json({ error: 'Insufficient milk in inventory' });
    }

    const transaction = db.transaction(() => {
      // Deduct milk
      db.prepare("UPDATE Inventory SET quantity = quantity - ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = (SELECT id FROM Products WHERE name = 'Milk')").run(milkUsed);
      // Add product
      db.prepare('UPDATE Inventory SET quantity = quantity + ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = ?').run(quantityProduced, productId);
      // Record production
      const info = db.prepare('INSERT INTO Production (productId, milkUsed, quantityProduced, workerId) VALUES (?, ?, ?, ?)').run(productId, milkUsed, quantityProduced, req.user.id);
      return info.lastInsertRowid;
    });

    try {
      const id = transaction();
      res.json({ id, productId, milkUsed, quantityProduced, workerId: req.user.id });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/production/:id', authenticate, requireRole(['Admin', 'Dairy Production Worker']), (req, res) => {
    const { id } = req.params;
    try {
      const record = db.prepare('SELECT milkUsed, quantityProduced, productId FROM Production WHERE id = ?').get() as any;
      if (record) {
        db.transaction(() => {
          db.prepare("UPDATE Inventory SET quantity = quantity + ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = (SELECT id FROM Products WHERE name = 'Milk')").run(record.milkUsed);
          db.prepare('UPDATE Inventory SET quantity = quantity - ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = ?').run(record.quantityProduced, record.productId);
          db.prepare('DELETE FROM Production WHERE id = ?').run(id);
        })();
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Inventory
  app.get('/api/inventory', authenticate, (req, res) => {
    const inventory = db.prepare(`
      SELECT i.*, p.name as productName, p.price 
      FROM Inventory i
      JOIN Products p ON i.productId = p.id
    `).all();
    res.json(inventory);
  });

  // Orders & Sales
  app.get('/api/orders', authenticate, (req: any, res) => {
    let orders;
    if (req.user.roleName === 'Customer') {
      const customer = db.prepare('SELECT id FROM Customers WHERE userId = ?').get(req.user.id) as any;
      if (!customer) return res.json([]);
      orders = db.prepare(`
        SELECT o.*, c.phone, c.address, u.name as customerName
        FROM Orders o
        JOIN Customers c ON o.customerId = c.id
        JOIN Users u ON c.userId = u.id
        WHERE o.customerId = ?
        ORDER BY o.createdAt DESC
      `).all(customer.id);
    } else {
      orders = db.prepare(`
        SELECT o.*, c.phone, c.address, u.name as customerName
        FROM Orders o
        LEFT JOIN Customers c ON o.customerId = c.id
        LEFT JOIN Users u ON c.userId = u.id
        ORDER BY o.createdAt DESC
      `).all();
    }
    
    const orderItems = db.prepare(`
      SELECT oi.*, p.name as productName 
      FROM OrderItems oi
      JOIN Products p ON oi.productId = p.id
    `).all();
    
    const ordersWithItems = orders.map((o: any) => ({
      ...o,
      items: orderItems.filter((i: any) => i.orderId === o.id)
    }));
    res.json(ordersWithItems);
  });

  app.post('/api/orders', authenticate, requireRole(['Admin', 'Counter Staff', 'Customer']), (req: any, res) => {
    const { items, paymentMethod } = req.body;
    // items: { productId, quantity, price }[]
    
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.price;
    }

    const transaction = db.transaction(() => {
      let customerId = null;
      if (req.user.roleName === 'Customer') {
        const customer = db.prepare('SELECT id FROM Customers WHERE userId = ?').get(req.user.id) as any;
        if (customer) customerId = customer.id;
      } else {
        // For counter staff, we might create a dummy customer or require customer details
        // Simplified for this example
        const dummyCustomer = db.prepare('SELECT id FROM Customers LIMIT 1').get() as any;
        customerId = dummyCustomer ? dummyCustomer.id : null;
      }

      // Check inventory
      for (const item of items) {
        const inv = db.prepare('SELECT quantity FROM Inventory WHERE productId = ?').get(item.productId) as any;
        if (!inv || inv.quantity < item.quantity) {
          throw new Error('Insufficient stock');
        }
      }

      // Create order
      const orderInfo = db.prepare('INSERT INTO Orders (customerId, totalAmount, paymentMethod) VALUES (?, ?, ?)').run(customerId, totalAmount, paymentMethod);
      const orderId = orderInfo.lastInsertRowid;

      // Create items and update inventory
      const insertItem = db.prepare('INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');
      const updateInv = db.prepare('UPDATE Inventory SET quantity = quantity - ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = ?');
      
      for (const item of items) {
        insertItem.run(orderId, item.productId, item.quantity, item.price);
        updateInv.run(item.quantity, item.productId);
      }

      // Create a delivery record for the order
      db.prepare('INSERT INTO Deliveries (orderId, status) VALUES (?, ?)').run(orderId, 'Pending');

      return orderId;
    });

    try {
      const id = transaction();
      res.json({ id, totalAmount, status: 'Pending' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/orders/:id/status', authenticate, requireRole(['Admin', 'Supervisor', 'Counter Staff', 'Customer']), (req: any, res) => {
    const { status } = req.body;
    const { id } = req.params;
    
    // Customers can only cancel their own orders
    if (req.user.roleName === 'Customer') {
      if (status !== 'Cancelled') {
        return res.status(403).json({ error: 'Customers can only cancel orders' });
      }
      const order = db.prepare('SELECT o.customerId, c.userId, o.status FROM Orders o JOIN Customers c ON o.customerId = c.id WHERE o.id = ?').get(id) as any;
      if (!order || order.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to cancel this order' });
      }
      if (order.status === 'Delivered' || order.status === 'Cancelled') {
        return res.status(400).json({ error: 'Cannot cancel an order that is already delivered or cancelled' });
      }
    }

    try {
      const transaction = db.transaction(() => {
        const order = db.prepare('SELECT status FROM Orders WHERE id = ?').get(id) as any;
        if (!order) throw new Error('Order not found');

        // Only process inventory if status is changing TO Cancelled from not Cancelled
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
          const items = db.prepare('SELECT productId, quantity FROM OrderItems WHERE orderId = ?').all(id) as any[];
          const updateInv = db.prepare('UPDATE Inventory SET quantity = quantity + ?, lastUpdated = CURRENT_TIMESTAMP WHERE productId = ?');
          for (const item of items) {
            updateInv.run(item.quantity, item.productId);
          }
          db.prepare("UPDATE Deliveries SET status = 'Cancelled' WHERE orderId = ?").run(id);
        }

        db.prepare('UPDATE Orders SET status = ? WHERE id = ?').run(status, id);
      });
      
      transaction();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Deliveries
  app.get('/api/deliveries', authenticate, requireRole(['Admin', 'Supervisor', 'Delivery Worker']), (req: any, res) => {
    let query = `
      SELECT d.*, o.totalAmount, o.status as orderStatus, c.phone, c.address, u.name as customerName, w.name as workerName 
      FROM Deliveries d 
      JOIN Orders o ON d.orderId = o.id 
      LEFT JOIN Customers c ON o.customerId = c.id
      LEFT JOIN Users u ON c.userId = u.id
      LEFT JOIN Users w ON d.workerId = w.id
    `;
    
    if (req.user.roleName === 'Delivery Worker') {
      query += ` WHERE d.workerId = ${req.user.id} OR d.workerId IS NULL`;
    }
    
    const deliveries = db.prepare(query).all();
    res.json(deliveries);
  });

  app.post('/api/deliveries', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const { orderId, workerId } = req.body;
    const info = db.prepare('INSERT INTO Deliveries (orderId, workerId) VALUES (?, ?)').run(orderId, workerId);
    db.prepare('UPDATE Orders SET status = ? WHERE id = ?').run('Out for delivery', orderId);
    res.json({ id: info.lastInsertRowid, orderId, workerId, status: 'Pending' });
  });

  app.put('/api/deliveries/:id/status', authenticate, requireRole(['Admin', 'Delivery Worker']), (req: any, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.prepare('UPDATE Deliveries SET status = ?, workerId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.user.id, id);
    const delivery = db.prepare('SELECT orderId FROM Deliveries WHERE id = ?').get(id) as any;
    if (delivery) {
      db.prepare('UPDATE Orders SET status = ? WHERE id = ?').run(status, delivery.orderId);
    }
    res.json({ success: true });
  });

  // Dashboard Stats
  app.get('/api/stats', authenticate, requireRole(['Admin', 'Supervisor']), (req, res) => {
    const range = req.query.range as string || 'today';
    let dateFilter = '';
    
    if (range === 'today') {
      dateFilter = "WHERE createdAt >= date('now')";
    } else if (range === 'weekly') {
      dateFilter = "WHERE createdAt >= date('now', '-7 days')";
    } else if (range === 'monthly') {
      dateFilter = "WHERE createdAt >= date('now', '-1 month')";
    } else if (range === 'yearly') {
      dateFilter = "WHERE createdAt >= date('now', '-1 year')";
    }

    const totalMilk = db.prepare(`SELECT SUM(quantity) as total FROM MilkCollection ${dateFilter}`).get() as any;
    const totalProduction = db.prepare(`SELECT SUM(quantityProduced) as total FROM Production ${dateFilter}`).get() as any;
    const totalSales = db.prepare(`SELECT SUM(totalAmount) as total FROM Orders ${dateFilter}`).get() as any;
    const inventory = db.prepare(`
      SELECT i.*, p.name as productName 
      FROM Inventory i
      JOIN Products p ON i.productId = p.id
    `).all();
    
    res.json({
      totalMilkCollected: totalMilk.total || 0,
      totalProduction: totalProduction.total || 0,
      totalSales: totalSales.total || 0,
      inventory
    });
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dairy.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roleName TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    roleId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(roleId) REFERENCES Roles(id)
  );

  CREATE TABLE IF NOT EXISTS Farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    village TEXT NOT NULL,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS MilkCollection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmerId INTEGER NOT NULL,
    quantity REAL NOT NULL,
    quality TEXT,
    verifiedBy INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(farmerId) REFERENCES Farmers(id),
    FOREIGN KEY(verifiedBy) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS Production (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    milkUsed REAL NOT NULL,
    quantityProduced REAL NOT NULL,
    workerId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(productId) REFERENCES Products(id),
    FOREIGN KEY(workerId) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER UNIQUE NOT NULL,
    quantity REAL NOT NULL DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(productId) REFERENCES Products(id)
  );

  CREATE TABLE IF NOT EXISTS Customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER UNIQUE,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    totalAmount REAL NOT NULL,
    paymentMethod TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customerId) REFERENCES Customers(id)
  );

  CREATE TABLE IF NOT EXISTS OrderItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(orderId) REFERENCES Orders(id),
    FOREIGN KEY(productId) REFERENCES Products(id)
  );

  CREATE TABLE IF NOT EXISTS Deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    workerId INTEGER,
    status TEXT DEFAULT 'Pending',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(orderId) REFERENCES Orders(id),
    FOREIGN KEY(workerId) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reportName TEXT NOT NULL,
    generatedBy INTEGER,
    generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataSnapshot TEXT,
    FOREIGN KEY(generatedBy) REFERENCES Users(id)
  );
`);

// Seed Roles
const roles = ['Admin', 'Supervisor', 'Counter Staff', 'Dairy Production Worker', 'Delivery Worker', 'Farmer', 'Customer'];
const checkRoles = db.prepare('SELECT count(*) as count FROM Roles').get() as { count: number };
if (checkRoles.count === 0) {
  const insertRole = db.prepare('INSERT INTO Roles (roleName) VALUES (?)');
  const insertTransaction = db.transaction(() => {
    for (const r of roles) {
      insertRole.run(r);
    }
  });
  insertTransaction();
}

// Seed Admin User
const adminRole = db.prepare('SELECT id FROM Roles WHERE roleName = ?').get('Admin') as any;
const checkAdmin = db.prepare('SELECT * FROM Users WHERE roleId = ?').get(adminRole.id);
if (!checkAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO Users (name, email, password, roleId) VALUES (?, ?, ?, ?)').run('Admin User', 'admin@dairy.com', hash, adminRole.id);
}

// Seed Products and Inventory
const products = [
  { name: 'Milk', price: 50, description: 'Fresh raw milk (1L)' },
  { name: 'Curd', price: 60, description: 'Fresh curd (1kg)' },
  { name: 'Buttermilk', price: 30, description: 'Refreshing buttermilk (1L)' },
  { name: 'Paneer', price: 350, description: 'Fresh paneer (1kg)' },
  { name: 'Ghee', price: 600, description: 'Pure cow ghee (1kg)' }
];
const checkProducts = db.prepare('SELECT count(*) as count FROM Products').get() as { count: number };
if (checkProducts.count === 0) {
  const insertProd = db.prepare('INSERT INTO Products (name, price, description) VALUES (?, ?, ?)');
  const insertInv = db.prepare('INSERT INTO Inventory (productId, quantity) VALUES (?, ?)');
  const insertTransaction = db.transaction(() => {
    for (const p of products) {
      const info = insertProd.run(p.name, p.price, p.description);
      insertInv.run(info.lastInsertRowid, 0);
    }
  });
  insertTransaction();
}

export default db;

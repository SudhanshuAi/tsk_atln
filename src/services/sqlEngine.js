import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let db = null;

// ─── Seed SQL ───────────────────────────────────────────────────────────────

const SEED_SQL = `
-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INTEGER PRIMARY KEY,
  supplier_name TEXT NOT NULL
);
INSERT INTO suppliers VALUES
(1,'Tech Innovations Inc'),(2,'Fashion Forward'),(3,'Home Essentials Co'),
(4,'Global Gourmet'),(5,'Active Life Gear'),(6,'Beauty Basics'),
(7,'Premium Electronics'),(8,'Kitchen Innovations'),(9,'Accessory World'),(10,'Fine Living');

-- Products
CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(supplier_id)
);
INSERT INTO products VALUES
(1,'Wireless Earbuds Pro','Electronics',99.99,1),
(2,'Smart Fitness Watch','Electronics',199.99,7),
(3,'Premium Running Shoes','Sports',89.99,5),
(4,'Organic Green Tea','Food',19.99,4),
(5,'Yoga Mat Premium','Fitness',29.99,5),
(6,'Bluetooth Speaker XL','Electronics',79.99,1),
(7,'Protein Powder','Food',49.99,4),
(8,'Gaming Mouse','Electronics',69.99,7),
(9,'Resistance Bands Set','Fitness',24.99,5),
(10,'Water Bottle','Sports',29.99,9),
(11,'Designer Jeans','Clothing',59.99,2),
(12,'Skincare Set','Beauty',59.99,6),
(13,'Coffee Maker Pro','Kitchen',119.99,8),
(14,'Leather Wallet','Accessories',39.99,9),
(15,'Portable Charger','Electronics',49.99,1),
(16,'Noise Cancelling Headphones','Electronics',149.99,7),
(17,'Trail Running Shoes','Sports',109.99,5),
(18,'Whey Protein Isolate','Food',64.99,4),
(19,'Foam Roller','Fitness',34.99,5),
(20,'Insulated Tumbler','Kitchen',39.99,8);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  product_id INTEGER PRIMARY KEY REFERENCES products(product_id),
  stock_quantity INTEGER NOT NULL
);
INSERT INTO inventory VALUES
(1,5),(2,10),(3,14),(4,45),(5,12),(6,19),(7,30),(8,22),(9,60),(10,18),
(11,35),(12,28),(13,8),(14,16),(15,7),(16,9),(17,25),(18,40),(19,55),(20,33);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age_group TEXT,
  gender TEXT,
  region TEXT,
  city TEXT
);
INSERT INTO customers VALUES
(1,'Emma Johnson','emma.j@email.com','25-34','Female','Northeast','New York'),
(2,'James Smith','james.s@email.com','35-44','Male','West','Los Angeles'),
(3,'Olivia Davis','olivia.d@email.com','25-34','Female','West','San Francisco'),
(4,'Robert Wilson','robert.w@email.com','45-54','Male','Midwest','Chicago'),
(5,'Sophia Brown','sophia.b@email.com','18-24','Female','South','Dallas'),
(6,'William Taylor','william.t@email.com','35-44','Male','Northeast','Boston'),
(7,'Isabella Miller','isabella.m@email.com','25-34','Female','South','Miami'),
(8,'Michael Anderson','michael.a@email.com','45-54','Male','West','Seattle'),
(9,'Charlotte Thomas','charlotte.t@email.com','55+','Female','South','Atlanta'),
(10,'Daniel Jackson','daniel.j@email.com','18-24','Male','Northeast','Philadelphia'),
(11,'Amelia Harris','amelia.h@email.com','25-34','Female','Midwest','Detroit'),
(12,'Ethan Martin','ethan.m@email.com','35-44','Male','West','Denver'),
(13,'Mia Thompson','mia.t@email.com','18-24','Female','South','Houston'),
(14,'Lucas Garcia','lucas.g@email.com','25-34','Male','Northeast','Washington DC'),
(15,'Harper Martinez','harper.m@email.com','45-54','Female','West','Los Angeles'),
(16,'Alexander Lee','alex.l@email.com','35-44','Male','Midwest','Cleveland'),
(17,'Evelyn Walker','evelyn.w@email.com','25-34','Female','South','Dallas'),
(18,'Henry Hall','henry.h@email.com','55+','Male','Northeast','New York'),
(19,'Abigail Allen','abigail.a@email.com','18-24','Female','West','San Francisco'),
(20,'Sebastian Young','seb.y@email.com','35-44','Male','South','Miami'),
(21,'Emily Hernandez','emily.h@email.com','25-34','Female','Midwest','Chicago'),
(22,'Jack King','jack.k@email.com','45-54','Male','West','Seattle'),
(23,'Elizabeth Wright','eliz.w@email.com','35-44','Female','Northeast','Boston'),
(24,'Aiden Scott','aiden.s@email.com','18-24','Male','South','Atlanta'),
(25,'Sofia Green','sofia.g@email.com','25-34','Female','West','Denver');

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id),
  order_date TEXT NOT NULL,
  order_amount REAL NOT NULL
);
INSERT INTO orders VALUES
(1,1,'2024-01-05',245.98),(2,1,'2024-02-14',189.99),(3,2,'2024-01-10',399.99),
(4,3,'2024-01-20',149.99),(5,3,'2024-03-08',299.98),(6,4,'2024-02-02',89.99),
(7,5,'2024-01-15',199.99),(8,5,'2024-03-22',74.98),(9,6,'2024-02-28',549.97),
(10,7,'2024-01-30',129.98),(11,8,'2024-03-05',249.99),(12,9,'2024-02-18',39.99),
(13,10,'2024-01-08',179.99),(14,11,'2024-03-12',89.98),(15,12,'2024-02-25',349.99),
(16,13,'2024-01-22',199.99),(17,14,'2024-03-18',59.99),(18,15,'2024-02-10',449.98),
(19,16,'2024-01-28',129.99),(20,17,'2024-03-25',99.99),(21,18,'2024-02-05',649.97),
(22,19,'2024-01-12',299.99),(23,20,'2024-03-30',189.98),(24,21,'2024-02-20',79.99),
(25,22,'2024-01-18',399.99),(26,1,'2024-04-03',159.99),(27,2,'2024-04-10',249.98),
(28,3,'2024-04-18',89.99),(29,4,'2024-05-02',319.99),(30,5,'2024-05-15',199.99),
(31,6,'2024-04-22',449.99),(32,7,'2024-05-08',99.98),(33,8,'2024-06-01',549.99),
(34,9,'2024-05-20',29.99),(35,10,'2024-06-12',259.99),(36,23,'2024-04-07',149.99),
(37,24,'2024-05-25',399.97),(38,25,'2024-06-20',89.99),(39,1,'2024-06-28',199.99),
(40,2,'2024-07-05',299.99),(41,3,'2024-07-15',149.98),(42,4,'2024-08-02',449.99),
(43,6,'2024-07-22',129.99),(44,12,'2024-08-10',249.98),(45,15,'2024-09-01',399.99);

-- Order Details
CREATE TABLE IF NOT EXISTS order_details (
  detail_id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id),
  product_id INTEGER REFERENCES products(product_id),
  quantity INTEGER NOT NULL
);
INSERT INTO order_details VALUES
(1,1,1,1),(2,1,4,2),(3,2,6,1),(4,3,2,1),(5,3,10,1),(6,4,5,2),(7,5,3,1),
(8,5,9,3),(9,6,4,3),(10,7,2,1),(11,8,9,2),(12,9,16,1),(13,9,14,1),(14,10,11,1),
(15,11,8,2),(16,12,4,2),(17,13,6,1),(18,13,9,2),(19,14,4,2),(20,15,2,1),
(21,15,12,1),(22,16,2,1),(23,17,4,3),(24,18,16,1),(25,18,12,1),(26,19,15,1),
(27,19,9,2),(28,20,10,2),(29,21,13,1),(30,21,14,1),(31,22,16,1),(32,22,9,2),
(33,23,3,1),(34,23,19,2),(35,24,4,2),(36,25,2,1),(37,26,6,1),(38,26,10,1),
(39,27,8,1),(40,27,15,1),(41,28,4,3),(42,29,16,1),(43,29,6,1),(44,30,2,1);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  employee_id INTEGER PRIMARY KEY,
  employee_name TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date TEXT
);
INSERT INTO employees VALUES
(1,'John Smith','Electronics','2021-03-15'),
(2,'Sarah Johnson','Home Goods','2020-07-22'),
(3,'Michael Brown','Electronics','2019-11-10'),
(4,'Emily Davis','Clothing','2022-01-05'),
(5,'David Wilson','Sports','2021-08-30'),
(6,'Jessica Miller','Beauty','2020-04-18'),
(7,'Robert Taylor','Electronics','2018-09-14'),
(8,'Amanda Anderson','Home Goods','2022-06-01');

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  sale_id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id),
  employee_id INTEGER REFERENCES employees(employee_id),
  quantity INTEGER NOT NULL,
  sale_amount REAL NOT NULL,
  sale_date TEXT NOT NULL
);
INSERT INTO sales VALUES
(1,1,1,5,499.95,'2024-01-10'),(2,2,3,3,599.97,'2024-01-12'),
(3,3,5,8,719.92,'2024-01-15'),(4,6,1,4,319.96,'2024-01-18'),
(5,8,7,6,419.94,'2024-01-22'),(6,11,4,10,599.90,'2024-01-25'),
(7,12,6,7,419.93,'2024-02-01'),(8,16,3,2,299.98,'2024-02-05'),
(9,1,1,8,799.92,'2024-02-10'),(10,5,2,15,449.85,'2024-02-14'),
(11,13,2,3,359.97,'2024-02-18'),(12,2,7,4,799.96,'2024-02-22'),
(13,4,6,20,399.80,'2024-03-01'),(14,7,5,10,499.90,'2024-03-05'),
(15,9,5,25,624.75,'2024-03-10'),(16,15,1,6,299.94,'2024-03-15'),
(17,6,3,5,399.95,'2024-03-20'),(18,20,8,12,479.88,'2024-03-25'),
(19,3,5,7,629.93,'2024-04-02'),(20,8,7,9,629.91,'2024-04-08'),
(21,1,3,12,1199.88,'2024-04-15'),(22,2,1,5,999.95,'2024-04-20'),
(23,11,4,8,479.92,'2024-04-25'),(24,12,6,6,359.94,'2024-05-01'),
(25,16,7,3,449.97,'2024-05-08'),(26,17,5,9,989.91,'2024-05-15'),
(27,4,6,30,599.70,'2024-05-20'),(28,7,5,15,749.85,'2024-05-28'),
(29,5,2,20,599.80,'2024-06-03'),(30,9,5,18,449.82,'2024-06-10');

-- Returns
CREATE TABLE IF NOT EXISTS returns (
  return_id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id),
  order_id INTEGER REFERENCES orders(order_id),
  return_amount REAL NOT NULL,
  return_date TEXT NOT NULL
);
INSERT INTO returns VALUES
(1,1,1,99.99,'2024-01-20'),(2,6,3,79.99,'2024-01-25'),
(3,2,7,199.99,'2024-02-05'),(4,11,14,59.99,'2024-02-15'),
(5,3,8,89.99,'2024-02-20'),(6,8,15,69.99,'2024-03-02'),
(7,16,21,149.99,'2024-03-08'),(8,12,22,59.99,'2024-03-15'),
(9,5,24,29.99,'2024-03-22'),(10,15,27,49.99,'2024-04-05');

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  review_id INTEGER PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id),
  customer_id INTEGER REFERENCES customers(customer_id),
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  review_date TEXT NOT NULL
);
INSERT INTO reviews VALUES
(1,1,1,5,'2024-01-25'),(2,1,3,4,'2024-02-10'),(3,1,5,5,'2024-03-15'),
(4,2,2,5,'2024-01-28'),(5,2,6,4,'2024-02-20'),(6,2,8,5,'2024-03-25'),
(7,3,4,4,'2024-02-05'),(8,3,10,5,'2024-03-10'),(9,3,12,3,'2024-04-15'),
(10,4,7,3,'2024-02-18'),(11,4,9,4,'2024-03-20'),(12,4,11,5,'2024-04-25'),
(13,5,13,4,'2024-02-22'),(14,5,15,5,'2024-03-28'),(15,5,17,4,'2024-05-02'),
(16,6,2,5,'2024-01-30'),(17,6,4,4,'2024-02-25'),(18,6,6,5,'2024-03-30'),
(19,8,1,5,'2024-02-08'),(20,8,3,4,'2024-03-12'),(21,8,5,5,'2024-04-18'),
(22,11,7,3,'2024-02-14'),(23,11,9,4,'2024-03-18'),(24,11,11,4,'2024-04-22'),
(25,12,13,5,'2024-02-20'),(26,12,15,4,'2024-03-24'),(27,12,17,5,'2024-04-28'),
(28,16,2,5,'2024-03-05'),(29,16,4,5,'2024-04-08'),(30,16,6,4,'2024-05-10');
`;

// ─── Public API ─────────────────────────────────────────────────────────────

export async function initDatabase() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  db = new SQL.Database();
  db.run(SEED_SQL);
  console.log('✅ sql.js database initialized with seed data');
}

export function executeSQL(sqlText) {
  if (!db) return { error: 'Database not initialized yet.' };

  const startTime = performance.now();
  try {
    // Split by semicolon to support multi-statement input
    const statements = sqlText
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map(s => s.trim())
      .filter(Boolean);

    let lastResult = null;
    let totalRowsAffected = 0;

    for (const stmt of statements) {
      const results = db.exec(stmt);

      if (results.length > 0) {
        const result = results[0];
        const columns = result.columns;
        const rows = result.values.map(row => {
          const obj = {};
          columns.forEach((col, i) => { obj[col] = row[i]; });
          return obj;
        });
        lastResult = { columns, rows };
      } else {
        // DML statement (INSERT/UPDATE/DELETE/CREATE/DROP)
        totalRowsAffected = db.getRowsModified();
        lastResult = {
          columns: [],
          rows: [],
          rowsAffected: totalRowsAffected,
          message: `Query OK, ${totalRowsAffected} row(s) affected`,
        };
      }
    }

    const executionTime = (performance.now() - startTime) / 1000;
    return { ...(lastResult || { columns: [], rows: [] }), executionTime };
  } catch (err) {
    return { error: err.message };
  }
}

export function getSchema() {
  if (!db) return [];
  try {
    const results = db.exec(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    );
    if (!results.length) return [];

    const tables = results[0].values.map(([name]) => name);
    return tables.map(tableName => {
      const colResults = db.exec(`PRAGMA table_info(${tableName})`);
      const columns = colResults.length
        ? colResults[0].values.map(col => ({
            name: col[1],
            type: col[2]?.toUpperCase() || 'TEXT',
          }))
        : [];
      return { tableName, columns };
    });
  } catch {
    return [];
  }
}

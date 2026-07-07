// Predefined queries — SQLite-compatible syntax
const PREDEFINED_QUERIES = [
  {
    id: 1,
    name: "Customer Orders",
    query: "SELECT c.customer_name, COUNT(o.order_id) AS total_orders,\n  ROUND(SUM(o.order_amount), 2) AS total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_name\nORDER BY total_spent DESC\nLIMIT 10;"
  },
  {
    id: 2,
    name: "Low Stock Products",
    query: "SELECT p.product_name, p.category, p.price, i.stock_quantity\nFROM products p\nJOIN inventory i ON p.product_id = i.product_id\nWHERE i.stock_quantity < 20\nORDER BY i.stock_quantity ASC;"
  },
  {
    id: 3,
    name: "Monthly Sales",
    query: "SELECT\n  CAST(strftime('%m', order_date) AS INTEGER) AS month,\n  CAST(strftime('%Y', order_date) AS INTEGER) AS year,\n  ROUND(SUM(order_amount), 2) AS total_sales\nFROM orders\nWHERE order_date >= '2024-01-01'\nGROUP BY year, month\nORDER BY year, month;"
  },
  {
    id: 4,
    name: "Employee Performance",
    query: "SELECT e.employee_name, e.department,\n  COUNT(s.sale_id) AS sales_count,\n  ROUND(SUM(s.sale_amount), 2) AS total_sales\nFROM employees e\nJOIN sales s ON e.employee_id = s.employee_id\nWHERE s.sale_date >= '2024-01-01'\nGROUP BY e.employee_name, e.department\nORDER BY total_sales DESC;"
  },
  {
    id: 5,
    name: "Category Performance",
    query: "SELECT p.category,\n  COUNT(DISTINCT p.product_id) AS product_count,\n  ROUND(SUM(s.sale_amount), 2) AS total_sales\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nGROUP BY p.category\nORDER BY total_sales DESC;"
  },
  {
    id: 6,
    name: "Customer Demographics",
    query: "SELECT c.age_group, c.gender,\n  COUNT(*) AS customer_count,\n  ROUND(AVG(o.order_amount), 2) AS avg_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.age_group, c.gender\nORDER BY customer_count DESC;"
  },
  {
    id: 7,
    name: "Regional Sales",
    query: "SELECT c.region, c.city,\n  COUNT(o.order_id) AS order_count,\n  ROUND(SUM(o.order_amount), 2) AS total_sales\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.region, c.city\nORDER BY total_sales DESC\nLIMIT 15;"
  },
  {
    id: 8,
    name: "Product Returns",
    query: "SELECT p.product_name, p.category,\n  COUNT(r.return_id) AS return_count,\n  ROUND(SUM(r.return_amount), 2) AS total_return_amount\nFROM products p\nJOIN returns r ON p.product_id = r.product_id\nGROUP BY p.product_name, p.category\nORDER BY return_count DESC\nLIMIT 10;"
  },
  {
    id: 9,
    name: "Supplier Performance",
    query: "SELECT s.supplier_name,\n  COUNT(p.product_id) AS products_supplied,\n  ROUND(AVG(p.price), 2) AS avg_product_price,\n  ROUND(AVG(i.stock_quantity), 1) AS avg_stock_level\nFROM suppliers s\nJOIN products p ON s.supplier_id = p.supplier_id\nJOIN inventory i ON p.product_id = i.product_id\nGROUP BY s.supplier_name\nORDER BY products_supplied DESC;"
  },
  {
    id: 10,
    name: "Top Selling Products",
    query: "SELECT p.product_name, p.category,\n  SUM(s.quantity) AS total_units_sold,\n  ROUND(SUM(s.sale_amount), 2) AS revenue\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nGROUP BY p.product_name, p.category\nORDER BY total_units_sold DESC\nLIMIT 10;"
  },
  {
    id: 11,
    name: "Customer Lifetime Value",
    query: "SELECT c.customer_name, c.email,\n  COUNT(DISTINCT o.order_id) AS total_orders,\n  ROUND(SUM(o.order_amount), 2) AS lifetime_value,\n  ROUND(AVG(o.order_amount), 2) AS avg_order_value\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_name, c.email\nHAVING COUNT(DISTINCT o.order_id) >= 3\nORDER BY lifetime_value DESC;"
  },
  {
    id: 12,
    name: "Product Reviews",
    query: "SELECT p.category,\n  ROUND(AVG(r.rating), 2) AS avg_rating,\n  COUNT(r.review_id) AS total_reviews,\n  COUNT(CASE WHEN r.rating >= 4 THEN 1 END) AS positive_reviews\nFROM products p\nJOIN reviews r ON p.product_id = r.product_id\nGROUP BY p.category\nORDER BY avg_rating DESC;"
  },
  {
    id: 13,
    name: "Recent Orders",
    query: "SELECT o.order_id, c.customer_name, c.city,\n  o.order_date, ROUND(o.order_amount, 2) AS order_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_date >= '2024-06-01'\nORDER BY o.order_date DESC;"
  },
  {
    id: 14,
    name: "Order Details Breakdown",
    query: "SELECT o.order_id, c.customer_name,\n  p.product_name, od.quantity,\n  ROUND(od.quantity * p.price, 2) AS line_total\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nJOIN order_details od ON o.order_id = od.order_id\nJOIN products p ON od.product_id = p.product_id\nORDER BY o.order_id, p.product_name\nLIMIT 30;"
  },
  {
    id: 15,
    name: "Electronics Sales",
    query: "SELECT p.product_name,\n  SUM(s.quantity) AS units_sold,\n  ROUND(SUM(s.sale_amount), 2) AS revenue,\n  ROUND(AVG(r.rating), 1) AS avg_rating\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nLEFT JOIN reviews r ON p.product_id = r.product_id\nWHERE p.category = 'Electronics'\nGROUP BY p.product_name\nORDER BY revenue DESC;"
  }
];

export default PREDEFINED_QUERIES;
// Sample predefined queries
const PREDEFINED_QUERIES = [
  {
    id: 1,
    name: "Customer Orders",
    query: "SELECT c.customer_name, COUNT(o.order_id) as total_orders, SUM(o.order_amount) as total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_name\nORDER BY total_spent DESC\nLIMIT 10;"
  },
  {
    id: 2,
    name: "Product Inventory",
    query: "SELECT p.product_name, p.category, p.price, i.stock_quantity\nFROM products p\nJOIN inventory i ON p.product_id = i.product_id\nWHERE i.stock_quantity < 20\nORDER BY i.stock_quantity ASC;"
  },
  {
    id: 3,
    name: "Monthly Sales",
    query: "SELECT EXTRACT(MONTH FROM order_date) as month,\nEXTRACT(YEAR FROM order_date) as year,\nSUM(order_amount) as total_sales\nFROM orders\nWHERE order_date >= '2024-01-01'\nGROUP BY month, year\nORDER BY year, month;"
  },
  {
    id: 4,
    name: "Employee Performance",
    query: "SELECT e.employee_name, e.department, COUNT(s.sale_id) as sales_count,\nSUM(s.sale_amount) as total_sales\nFROM employees e\nJOIN sales s ON e.employee_id = s.employee_id\nWHERE s.sale_date >= '2024-01-01'\nGROUP BY e.employee_name, e.department\nORDER BY total_sales DESC;"
  },
  {
    id: 5,
    name: "Category Performance",
    query: "SELECT p.category, COUNT(DISTINCT p.product_id) as product_count, SUM(s.sales_amount) as total_sales\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nGROUP BY p.category\nORDER BY total_sales DESC;"
  },
  {
    id: 6,
    name: "Customer Demographics",
    query: "SELECT c.age_group, c.gender, COUNT(*) as customer_count, AVG(o.order_amount) as avg_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.age_group, c.gender\nORDER BY customer_count DESC;"
  },
  {
    id: 7,
    name: "Regional Sales",
    query: "SELECT c.region, c.city, COUNT(o.order_id) as order_count, SUM(o.order_amount) as total_sales\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.region, c.city\nORDER BY total_sales DESC\nLIMIT 15;"
  },
  {
    id: 8,
    name: "Product Returns Analysis",
    query: "SELECT p.product_name, p.category, COUNT(r.return_id) as return_count, \nSUM(r.return_amount) as total_return_amount\nFROM products p\nJOIN returns r ON p.product_id = r.product_id\nGROUP BY p.product_name, p.category\nORDER BY return_count DESC\nLIMIT 10;"
  },
  {
    id: 9,
    name: "Supplier Performance",
    query: "SELECT s.supplier_name, COUNT(p.product_id) as products_supplied,\nAVG(p.price) as avg_product_price, AVG(i.stock_quantity) as avg_stock_level\nFROM suppliers s\nJOIN products p ON s.supplier_id = p.supplier_id\nJOIN inventory i ON p.product_id = i.product_id\nGROUP BY s.supplier_name\nORDER BY products_supplied DESC;"
  },
  {
    id: 10,
    name: "Customer Retention",
    query: "SELECT \n  EXTRACT(YEAR FROM first_order) as acquisition_year,\n  COUNT(DISTINCT customer_id) as total_customers,\n  SUM(CASE WHEN order_year = acquisition_year + 1 THEN 1 ELSE 0 END) as retained_customers,\n  ROUND(SUM(CASE WHEN order_year = acquisition_year + 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT customer_id), 2) as retention_rate\nFROM (\n  SELECT \n    c.customer_id,\n    MIN(EXTRACT(YEAR FROM o.order_date)) as first_order,\n    EXTRACT(YEAR FROM o.order_date) as order_year\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  GROUP BY c.customer_id, EXTRACT(YEAR FROM o.order_date)\n) AS customer_years\nGROUP BY acquisition_year\nORDER BY acquisition_year;"
  },
  {
    id: 11,
    name: "Top Selling Products",
    query: "SELECT p.product_name, p.category, SUM(s.quantity) as total_units_sold,\nSUM(s.quantity * p.price) as revenue\nFROM products p\nJOIN sales s ON p.product_id = s.product_id\nGROUP BY p.product_name, p.category\nORDER BY total_units_sold DESC\nLIMIT 10;"
  },
  {
    id: 12,
    name: "Customer Lifetime Value",
    query: "SELECT c.customer_name, c.email,\nCOUNT(DISTINCT o.order_id) as total_orders,\nSUM(o.order_amount) as lifetime_value,\nAVG(o.order_amount) as avg_order_value\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_name, c.email\nHAVING COUNT(DISTINCT o.order_id) >= 5\nORDER BY lifetime_value DESC;"
  },
  {
    id: 13,
    name: "Seasonal Sales Analysis",
    query: "SELECT\n  EXTRACT(MONTH FROM order_date) as month,\n  EXTRACT(YEAR FROM order_date) as year,\n  p.category,\n  SUM(od.quantity) as units_sold,\n  SUM(od.quantity * p.price) as revenue\nFROM orders o\nJOIN order_details od ON o.order_id = od.order_id\nJOIN products p ON od.product_id = p.product_id\nWHERE order_date >= '2024-01-01'\nGROUP BY month, year, p.category\nORDER BY year, month, revenue DESC;"
  },
  {
    id: 14,
    name: "Customer Satisfaction",
    query: "SELECT\n  p.category,\n  ROUND(AVG(r.rating), 2) as avg_rating,\n  COUNT(r.review_id) as total_reviews,\n  COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_reviews\nFROM products p\nJOIN reviews r ON p.product_id = r.product_id\nGROUP BY p.category\nORDER BY avg_rating DESC;"
  },
  {
    id: 15,
    name: "Inventory Turnover",
    query: "SELECT\n  p.product_name,\n  p.category,\n  i.stock_quantity as current_stock,\n  SUM(s.quantity) as units_sold_last_30_days,\n  ROUND(SUM(s.quantity) * 30.0 / i.stock_quantity, 2) as turnover_rate\nFROM products p\nJOIN inventory i ON p.product_id = i.product_id\nJOIN sales s ON p.product_id = s.product_id\nWHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY p.product_name, p.category, i.stock_quantity\nHAVING i.stock_quantity > 0\nORDER BY turnover_rate DESC;"
  }
];

export default PREDEFINED_QUERIES;
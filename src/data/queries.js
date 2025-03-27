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
  }
];

export default PREDEFINED_QUERIES;
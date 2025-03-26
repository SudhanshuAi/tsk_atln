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
  }
];

export default PREDEFINED_QUERIES;
// Sample dummy data for each query
const DUMMY_RESULTS = {
    1: {
      columns: ["customer_name", "total_orders", "total_spent"],
      rows: [
        { customer_name: "Emma Johnson", total_orders: 12, total_spent: 2450.99 },
        { customer_name: "James Smith", total_orders: 8, total_spent: 1845.50 },
        { customer_name: "Olivia Davis", total_orders: 15, total_spent: 1720.25 },
        { customer_name: "Robert Wilson", total_orders: 6, total_spent: 1690.00 },
        { customer_name: "Sophia Brown", total_orders: 9, total_spent: 1580.75 },
        { customer_name: "William Taylor", total_orders: 5, total_spent: 1320.50 },
        { customer_name: "Isabella Miller", total_orders: 7, total_spent: 1290.25 },
        { customer_name: "Michael Anderson", total_orders: 4, total_spent: 980.00 },
        { customer_name: "Charlotte Thomas", total_orders: 3, total_spent: 850.50 },
        { customer_name: "Daniel Jackson", total_orders: 2, total_spent: 720.25 }
      ]
    },
    2: {
      columns: ["product_name", "category", "price", "stock_quantity"],
      rows: [
        { product_name: "Wireless Earbuds", category: "Electronics", price: 89.99, stock_quantity: 5 },
        { product_name: "Premium Coffee Beans", category: "Food", price: 24.99, stock_quantity: 8 },
        { product_name: "Smart Watch", category: "Electronics", price: 199.99, stock_quantity: 10 },
        { product_name: "Yoga Mat", category: "Fitness", price: 29.99, stock_quantity: 12 },
        { product_name: "Portable Charger", category: "Electronics", price: 49.99, stock_quantity: 15 },
        { product_name: "Leather Wallet", category: "Accessories", price: 39.99, stock_quantity: 16 },
        { product_name: "Stainless Water Bottle", category: "Kitchen", price: 34.99, stock_quantity: 18 },
        { product_name: "Bluetooth Speaker", category: "Electronics", price: 79.99, stock_quantity: 19 }
      ]
    },
    3: {
      columns: ["month", "year", "total_sales"],
      rows: [
        { month: 1, year: 2024, total_sales: 28450.75 },
        { month: 2, year: 2024, total_sales: 32150.50 },
        { month: 3, year: 2024, total_sales: 35780.25 },
        { month: 4, year: 2024, total_sales: 29890.00 },
        { month: 5, year: 2024, total_sales: 38450.75 },
        { month: 6, year: 2024, total_sales: 42100.50 },
        { month: 7, year: 2024, total_sales: 45780.25 },
        { month: 8, year: 2024, total_sales: 39890.00 },
        { month: 9, year: 2024, total_sales: 52450.75 },
        { month: 10, year: 2024, total_sales: 48750.50 }
      ]
    },
    4: {
      columns: ["employee_name", "department", "sales_count", "total_sales"],
      rows: [
        { employee_name: "John Smith", department: "Electronics", sales_count: 42, total_sales: 28450.75 },
        { employee_name: "Sarah Johnson", department: "Home Goods", sales_count: 38, total_sales: 24150.50 },
        { employee_name: "Michael Brown", department: "Electronics", sales_count: 45, total_sales: 32780.25 },
        { employee_name: "Emily Davis", department: "Clothing", sales_count: 36, total_sales: 22890.00 },
        { employee_name: "David Wilson", department: "Sports", sales_count: 30, total_sales: 18450.75 },
        { employee_name: "Jessica Miller", department: "Beauty", sales_count: 28, total_sales: 16100.50 },
        { employee_name: "Robert Taylor", department: "Electronics", sales_count: 40, total_sales: 26780.25 },
        { employee_name: "Amanda Anderson", department: "Home Goods", sales_count: 32, total_sales: 20890.00 }
      ]
    }
  };
  
  export default DUMMY_RESULTS;
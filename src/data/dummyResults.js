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
    },
    5: {
      columns: ["category", "product_count", "total_sales"],
      rows: [
        { category: "Electronics", product_count: 24, total_sales: 87450.75 },
        { category: "Clothing", product_count: 18, total_sales: 52150.50 },
        { category: "Home Goods", product_count: 15, total_sales: 48780.25 },
        { category: "Sports", product_count: 12, total_sales: 36890.00 },
        { category: "Beauty", product_count: 10, total_sales: 28450.75 },
        { category: "Food", product_count: 8, total_sales: 22100.50 },
        { category: "Kitchen", product_count: 7, total_sales: 18780.25 },
        { category: "Accessories", product_count: 6, total_sales: 14890.00 }
      ]
    },
    6: {
      columns: ["age_group", "gender", "customer_count", "avg_order"],
      rows: [
        { age_group: "25-34", gender: "Female", customer_count: 450, avg_order: 125.50 },
        { age_group: "25-34", gender: "Male", customer_count: 380, avg_order: 115.75 },
        { age_group: "35-44", gender: "Female", customer_count: 320, avg_order: 145.25 },
        { age_group: "35-44", gender: "Male", customer_count: 290, avg_order: 155.50 },
        { age_group: "18-24", gender: "Female", customer_count: 280, avg_order: 85.75 },
        { age_group: "18-24", gender: "Male", customer_count: 250, avg_order: 75.25 },
        { age_group: "45-54", gender: "Female", customer_count: 220, avg_order: 165.00 },
        { age_group: "45-54", gender: "Male", customer_count: 190, avg_order: 175.50 },
        { age_group: "55+", gender: "Female", customer_count: 150, avg_order: 135.25 },
        { age_group: "55+", gender: "Male", customer_count: 120, avg_order: 145.75 }
      ]
    },
    7: {
      columns: ["region", "city", "order_count", "total_sales"],
      rows: [
        { region: "West", city: "Los Angeles", order_count: 1250, total_sales: 185450.75 },
        { region: "Northeast", city: "New York", order_count: 1120, total_sales: 172150.50 },
        { region: "West", city: "San Francisco", order_count: 950, total_sales: 145780.25 },
        { region: "Midwest", city: "Chicago", order_count: 820, total_sales: 128890.00 },
        { region: "South", city: "Dallas", order_count: 780, total_sales: 115450.75 },
        { region: "Northeast", city: "Boston", order_count: 750, total_sales: 108100.50 },
        { region: "South", city: "Miami", order_count: 720, total_sales: 102780.25 },
        { region: "Midwest", city: "Detroit", order_count: 650, total_sales: 94890.00 },
        { region: "West", city: "Seattle", order_count: 620, total_sales: 92450.75 },
        { region: "South", city: "Atlanta", order_count: 580, total_sales: 88150.50 },
        { region: "Northeast", city: "Philadelphia", order_count: 540, total_sales: 82780.25 },
        { region: "Midwest", city: "Cleveland", order_count: 510, total_sales: 74890.00 },
        { region: "West", city: "Denver", order_count: 480, total_sales: 72450.75 },
        { region: "South", city: "Houston", order_count: 450, total_sales: 68100.50 },
        { region: "Northeast", city: "Washington DC", order_count: 420, total_sales: 62780.25 }
      ]
    },
    8: {
      columns: ["product_name", "category", "return_count", "total_return_amount"],
      rows: [
        { product_name: "Wireless Earbuds", category: "Electronics", return_count: 48, total_return_amount: 4319.52 },
        { product_name: "Smart Watch", category: "Electronics", return_count: 35, total_return_amount: 6999.65 },
        { product_name: "Designer Jeans", category: "Clothing", return_count: 32, total_return_amount: 2879.68 },
        { product_name: "Running Shoes", category: "Sports", return_count: 29, total_return_amount: 3479.71 },
        { product_name: "Bluetooth Speaker", category: "Electronics", return_count: 25, total_return_amount: 1999.75 },
        { product_name: "Yoga Mat", category: "Fitness", return_count: 22, total_return_amount: 659.78 },
        { product_name: "Premium Coffee Maker", category: "Kitchen", return_count: 20, total_return_amount: 2399.80 },
        { product_name: "Skincare Set", category: "Beauty", return_count: 18, total_return_amount: 1079.82 },
        { product_name: "Portable Charger", category: "Electronics", return_count: 15, total_return_amount: 749.85 },
        { product_name: "Leather Wallet", category: "Accessories", return_count: 12, total_return_amount: 479.88 }
      ]
    },
    9: {
      columns: ["supplier_name", "products_supplied", "avg_product_price", "avg_stock_level"],
      rows: [
        { supplier_name: "Tech Innovations Inc", products_supplied: 45, avg_product_price: 129.99, avg_stock_level: 32 },
        { supplier_name: "Fashion Forward", products_supplied: 38, avg_product_price: 59.99, avg_stock_level: 42 },
        { supplier_name: "Home Essentials Co", products_supplied: 32, avg_product_price: 45.50, avg_stock_level: 38 },
        { supplier_name: "Global Gourmet", products_supplied: 28, avg_product_price: 24.99, avg_stock_level: 45 },
        { supplier_name: "Active Life Gear", products_supplied: 25, avg_product_price: 39.95, avg_stock_level: 35 },
        { supplier_name: "Beauty Basics", products_supplied: 22, avg_product_price: 32.99, avg_stock_level: 40 },
        { supplier_name: "Premium Electronics", products_supplied: 20, avg_product_price: 199.99, avg_stock_level: 25 },
        { supplier_name: "Kitchen Innovations", products_supplied: 18, avg_product_price: 75.50, avg_stock_level: 30 },
        { supplier_name: "Accessory World", products_supplied: 15, avg_product_price: 29.99, avg_stock_level: 48 },
        { supplier_name: "Fine Living", products_supplied: 12, avg_product_price: 89.95, avg_stock_level: 28 }
      ]
    },
    10: {
      columns: ["acquisition_year", "total_customers", "retained_customers", "retention_rate"],
      rows: [
        { acquisition_year: 2020, total_customers: 1200, retained_customers: 840, retention_rate: 70.00 },
        { acquisition_year: 2021, total_customers: 1550, retained_customers: 1023, retention_rate: 66.00 },
        { acquisition_year: 2022, total_customers: 1850, retained_customers: 1295, retention_rate: 70.00 },
        { acquisition_year: 2023, total_customers: 2100, retained_customers: 1554, retention_rate: 74.00 },
        { acquisition_year: 2024, total_customers: 2450, retained_customers: 0, retention_rate: 0.00 }
      ]
    },
    11: {
      columns: ["product_name", "category", "total_units_sold", "revenue"],
      rows: [
        { product_name: "Wireless Earbuds Pro", category: "Electronics", total_units_sold: 1250, revenue: 124875.00 },
        { product_name: "Smart Fitness Watch", category: "Electronics", total_units_sold: 980, revenue: 195980.00 },
        { product_name: "Premium Running Shoes", category: "Sports", total_units_sold: 850, revenue: 76500.00 },
        { product_name: "Organic Green Tea", category: "Food", total_units_sold: 780, revenue: 15560.00 },
        { product_name: "Yoga Mat Premium", category: "Fitness", total_units_sold: 720, revenue: 21580.00 },
        { product_name: "Bluetooth Speaker XL", category: "Electronics", total_units_sold: 680, revenue: 54360.00 },
        { product_name: "Protein Powder", category: "Food", total_units_sold: 650, revenue: 32450.00 },
        { product_name: "Gaming Mouse", category: "Electronics", total_units_sold: 620, revenue: 43400.00 },
        { product_name: "Resistance Bands Set", category: "Fitness", total_units_sold: 580, revenue: 17400.00 },
        { product_name: "Water Bottle", category: "Sports", total_units_sold: 550, revenue: 16480.00 }
      ]
    },
    12: {
      columns: ["customer_name", "email", "total_orders", "lifetime_value", "avg_order_value"],
      rows: [
        { customer_name: "Sarah Williams", email: "sarah.w@email.com", total_orders: 28, lifetime_value: 8450.75, avg_order_value: 301.81 },
        { customer_name: "David Chen", email: "david.c@email.com", total_orders: 25, lifetime_value: 7250.50, avg_order_value: 290.02 },
        { customer_name: "Maria Garcia", email: "maria.g@email.com", total_orders: 22, lifetime_value: 6780.25, avg_order_value: 308.19 },
        { customer_name: "Alex Thompson", email: "alex.t@email.com", total_orders: 20, lifetime_value: 5890.00, avg_order_value: 294.50 },
        { customer_name: "Lisa Brown", email: "lisa.b@email.com", total_orders: 18, lifetime_value: 5450.75, avg_order_value: 302.82 },
        { customer_name: "Kevin Lee", email: "kevin.l@email.com", total_orders: 15, lifetime_value: 4100.50, avg_order_value: 273.37 }
      ]
    },
    13: {
      columns: ["month", "year", "category", "units_sold", "revenue"],
      rows: [
        { month: 1, year: 2024, category: "Electronics", units_sold: 450, revenue: 89750.00 },
        { month: 1, year: 2024, category: "Clothing", units_sold: 380, revenue: 45600.00 },
        { month: 2, year: 2024, category: "Electronics", units_sold: 520, revenue: 104000.00 },
        { month: 2, year: 2024, category: "Sports", units_sold: 290, revenue: 34800.00 },
        { month: 3, year: 2024, category: "Electronics", units_sold: 480, revenue: 96000.00 },
        { month: 3, year: 2024, category: "Beauty", units_sold: 320, revenue: 25600.00 }
      ]
    },
    14: {
      columns: ["category", "avg_rating", "total_reviews", "positive_reviews"],
      rows: [
        { category: "Electronics", avg_rating: 4.5, total_reviews: 2450, positive_reviews: 1960 },
        { category: "Sports", avg_rating: 4.3, total_reviews: 1850, positive_reviews: 1480 },
        { category: "Beauty", avg_rating: 4.2, total_reviews: 1650, positive_reviews: 1320 },
        { category: "Home Goods", avg_rating: 4.1, total_reviews: 1450, positive_reviews: 1160 },
        { category: "Clothing", avg_rating: 4.0, total_reviews: 2150, positive_reviews: 1720 },
        { category: "Food", avg_rating: 3.9, total_reviews: 950, positive_reviews: 760 }
      ]
    },
    15: {
      columns: ["product_name", "category", "current_stock", "units_sold_last_30_days", "turnover_rate"],
      rows: [
        { product_name: "Wireless Earbuds Pro", category: "Electronics", current_stock: 100, units_sold_last_30_days: 85, turnover_rate: 25.5 },
        { product_name: "Running Shoes Elite", category: "Sports", current_stock: 80, units_sold_last_30_days: 60, turnover_rate: 22.5 },
        { product_name: "Smart Watch Series 5", category: "Electronics", current_stock: 150, units_sold_last_30_days: 95, turnover_rate: 19.0 },
        { product_name: "Yoga Mat Premium", category: "Fitness", current_stock: 120, units_sold_last_30_days: 75, turnover_rate: 18.75 },
        { product_name: "Gaming Keyboard", category: "Electronics", current_stock: 200, units_sold_last_30_days: 110, turnover_rate: 16.5 },
        { product_name: "Protein Powder Plus", category: "Food", current_stock: 180, units_sold_last_30_days: 90, turnover_rate: 15.0 }
      ]
    }
  };
  
  export default DUMMY_RESULTS;
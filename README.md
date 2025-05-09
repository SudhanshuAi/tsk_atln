# SQL Query Runner

A frontend application for running SQL queries and visualizing results, developed for the Frontend Task 2025.

## Overview

SQL Query Runner is a React-based web application that allows users to write SQL queries and visualize the results. The application includes predefined queries, a SQL editor, and a results viewer with export capabilities.

## Features

- **SQL Query Editor**: Write and edit SQL queries with a clean, intuitive interface
- **Predefined Queries**: Select from a set of sample queries for quick access
- **Results Visualization**: View query results in a well-formatted table
- **Recent Queries**: Keep track of recently executed queries
- **Export Functionality**: Export results to CSV format
- **Dark/Light Theme**: Toggle between dark and light modes for better viewing comfort
- **Performance Metrics**: View query execution time
- **Bookmarking**: Save important queries for later reference

### Technologies Used

### Core Framework

-   **React**: Used for the UI component architecture
-   **Zustand**: Lightweight state management with persistence
-   **React Router**: For navigation (though currently a single-page application)

### UI Components and Styling

-   **React Icons**: Comprehensive icon library
-   **React Loading Skeleton**: For loading states and placeholders
-   **CSS Modules**: For component-scoped styling

### Development Tools

-   **Vite**: For fast development and optimized builds
-   **ESLint**: For code quality and consistency
-   **Prettier**: For code formatting

## Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/your-username/sql-query-runner.git
   cd sql-query-runner
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Performance Optimization

<img width="900" alt="{D887BF78-074E-45A8-A9A4-2884768F0996}" src="https://github.com/user-attachments/assets/ed4a1606-064c-4259-8ba4-538d50bc3d0f" />


- **Execution Time**: The application's load time is optimized to be under 0.5 seconds
- **Measurements**:
   - Performance metrics were measured using Chrome DevTools (Lighthouse)
   - The result table's loading time was measured using the Performance API, which ranged between 0.8 and 0.81 seconds
- **Optimizations**:
  - Component splitting for better code organization and reusability
  - Efficient state management to minimize re-renders
  - Lazy loading of results to handle potentially large datasets
  - CSS optimizations to reduce paint and layout operations

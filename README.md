# SQL Query Runner

A frontend application for running SQL queries and visualizing results, developed for the Atlan Frontend Internship Task 2025.

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

## Technologies Used

- **React**: JavaScript framework for building the user interface
- **React Icons**: Icon library for UI elements
- **Zustand**: Global State Management Library
- **CSS**: Custom styling
- **Vite**: Fast build tool for development

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

- **Execution Time**: The application's load time is optimized to be under 2 seconds
- **Measurement**: Performance was measured using Chrome DevTools Lighthouse and Performance API
- **Optimizations**:
  - Component splitting for better code organization and reusability
  - Efficient state management to minimize re-renders
  - Lazy loading of results to handle potentially large datasets
  - CSS optimizations to reduce paint and layout operations

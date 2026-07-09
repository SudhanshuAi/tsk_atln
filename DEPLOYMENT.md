# SQL IDE Deployment Guide (Dual-Hosting Architecture)

This guide walks you through deploying your SQL IDE using the **professional dual-hosting architecture**:
1. **Backend Proxy Server** deployed to **Render** (persistent Node.js process).
2. **Frontend App** deployed to **Vercel** (fast, global CDN).

---

## Part 1: Deploying the Backend to Render

[Render](https://render.com) is a great choice for hosting node servers on their free tier.

### 1. Connect to GitHub
- Log into [Render](https://dashboard.render.com).
- Click **New +** at the top right and select **Web Service**.
- Connect your GitHub account and select your SQL IDE repository.

### 2. Configure the Web Service
Configure the settings as follows:
- **Name:** `sql-ide-backend` (or any custom name)
- **Region:** Choose the region closest to you
- **Branch:** `main` (or whichever branch you are using)
- **Root Directory:** *(Keep blank / root)*
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm run start` (We added this script to run `node server/index.js`)
- **Instance Type:** Select **Free**

### 3. Deploy
- Click **Create Web Service** at the bottom of the page.
- Render will install dependencies and start your server.
- Once the deployment succeeds, copy your backend URL shown at the top of the dashboard. It will look like this:
  `https://sql-ide-backend-xyz.onrender.com`

---

## Part 2: Deploying the Frontend to Vercel

[Vercel](https://vercel.com) will build your React/Vite frontend and host it stably.

### 1. Import your Repository
- Log into [Vercel](https://vercel.com).
- Click **Add New** -> **Project**.
- Import your SQL IDE repository.

### 2. Configure Build & Environment Variables
- Keep **Framework Preset** as **Vite** (Vercel detects this automatically).
- Expand **Environment Variables** (this is the most important step) and add:
  - **Key:** `VITE_API_BASE_URL`
  - **Value:** Your Render backend URL followed by `/api` 
    *(Example: `https://sql-ide-backend-xyz.onrender.com/api`)*
  - Click **Add**.

> [!IMPORTANT]
> Make sure there is **no trailing slash** at the end of the URL.

### 3. Deploy
- Click **Deploy**.
- Vercel will build the frontend assets (`dist/`) and deploy them.
- Once it is finished, click on the preview window to visit your live SQL IDE.

---

## How It Works Now
- **Sample DB (SQLite)** runs immediately in the visitor's browser using WebAssembly.
- When a user goes to **Connect to DB** (MySQL/Postgres) and fires a query, the Vercel frontend securely routes the command to your Render backend link (`apiClient.js`), which processes the connection proxy and replies with results.

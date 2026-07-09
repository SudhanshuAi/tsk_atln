import express from 'express';
import cors from 'cors';
import connectionRouter from './routes/connection.js';
import queryRouter from './routes/query.js';
import schemaRouter from './routes/schema.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS from any origin (supports Vercel preview deploys out of the box)
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', connectionRouter);
app.use('/api', queryRouter);
app.use('/api', schemaRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`\n🚀 SQL IDE Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

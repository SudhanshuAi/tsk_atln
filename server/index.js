import express from 'express';
import cors from 'cors';
import connectionRouter from './routes/connection.js';
import queryRouter from './routes/query.js';
import schemaRouter from './routes/schema.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
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

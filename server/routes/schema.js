import express from 'express';
import { getConnection } from '../connectionStore.js';
import { getSchema as mysqlSchema } from '../adapters/mysql.js';
import { getSchema as pgSchema } from '../adapters/postgres.js';

const router = express.Router();

// GET /api/schema?connectionId=xxx
router.get('/schema', async (req, res) => {
  const { connectionId } = req.query;
  if (!connectionId) {
    return res.status(400).json({ error: 'Missing connectionId query param' });
  }

  const conn = getConnection(connectionId);
  if (!conn) {
    return res.status(404).json({ error: 'Connection not found. Please reconnect.' });
  }

  try {
    let schema;
    if (conn.type === 'mysql') {
      schema = await mysqlSchema(conn.pool);
    } else if (conn.type === 'postgres') {
      schema = await pgSchema(conn.pool);
    } else {
      return res.status(400).json({ error: `Unknown connection type: ${conn.type}` });
    }
    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

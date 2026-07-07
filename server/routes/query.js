import express from 'express';
import { getConnection } from '../connectionStore.js';
import { runQuery as mysqlQuery } from '../adapters/mysql.js';
import { runQuery as pgQuery } from '../adapters/postgres.js';

const router = express.Router();

// POST /api/query
router.post('/query', async (req, res) => {
  const { connectionId, sql } = req.body;

  if (!connectionId || !sql) {
    return res.status(400).json({ error: 'Missing connectionId or sql' });
  }

  const conn = getConnection(connectionId);
  if (!conn) {
    return res.status(404).json({ error: 'Connection not found. Please reconnect.' });
  }

  try {
    let result;
    if (conn.type === 'mysql') {
      result = await mysqlQuery(conn.pool, sql);
    } else if (conn.type === 'postgres') {
      result = await pgQuery(conn.pool, sql);
    } else {
      return res.status(400).json({ error: `Unknown connection type: ${conn.type}` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

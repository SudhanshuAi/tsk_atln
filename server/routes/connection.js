import express from 'express';
import { connect as mysqlConnect, getSchema as mysqlSchema } from '../adapters/mysql.js';
import { connect as pgConnect, getSchema as pgSchema } from '../adapters/postgres.js';
import { addConnection, removeConnection, listConnections, getConnection } from '../connectionStore.js';

const router = express.Router();

// POST /api/connect
router.post('/connect', async (req, res) => {
  const { type, host, port, user, password, database } = req.body;

  if (!type || !host || !user || !database) {
    return res.status(400).json({ error: 'Missing required fields: type, host, user, database' });
  }

  try {
    let pool;
    let schema;

    if (type === 'mysql') {
      pool = await mysqlConnect({ host, port, user, password, database });
      schema = await mysqlSchema(pool);
    } else if (type === 'postgres') {
      pool = await pgConnect({ host, port, user, password, database });
      schema = await pgSchema(pool);
    } else {
      return res.status(400).json({ error: `Unsupported DB type: ${type}` });
    }

    const connectionId = addConnection(pool, type, {
      name: `${database}@${host}`,
      database,
      host,
      type,
    });

    res.json({ connectionId, schema, name: `${database}@${host}`, type, database });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/disconnect
router.delete('/disconnect', (req, res) => {
  const { connectionId } = req.body;
  if (!connectionId) return res.status(400).json({ error: 'Missing connectionId' });
  removeConnection(connectionId);
  res.json({ ok: true });
});

// GET /api/connections
router.get('/connections', (req, res) => {
  res.json(listConnections());
});

export default router;

/**
 * In-memory registry of active DB connections.
 * Maps connectionId → { pool, type, meta }
 */
const connections = new Map();
let idCounter = 1;

function createId() {
  return `conn_${idCounter++}_${Date.now()}`;
}

function addConnection(pool, type, meta) {
  const id = createId();
  connections.set(id, { pool, type, meta });
  return id;
}

function getConnection(id) {
  return connections.get(id) || null;
}

function removeConnection(id) {
  const conn = connections.get(id);
  if (conn) {
    try {
      if (conn.type === 'mysql') conn.pool.end();
      if (conn.type === 'postgres') conn.pool.end();
    } catch (_) {}
    connections.delete(id);
  }
}

function listConnections() {
  const result = [];
  for (const [id, { type, meta }] of connections.entries()) {
    result.push({ connectionId: id, type, ...meta });
  }
  return result;
}

export { addConnection, getConnection, removeConnection, listConnections };

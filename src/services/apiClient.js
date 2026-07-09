// Production backend URL should be set via VITE_API_BASE_URL env variable on Vercel.
// For local environment, it defaults to '/api' which is proxied by Vite.
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function del(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

export const apiClient = {
  connectToDb: (config) => post('/connect', config),
  disconnectDb: (connectionId) => del('/disconnect', { connectionId }),
  executeQuery: (connectionId, sql) => post('/query', { connectionId, sql }),
  fetchSchema: (connectionId) => get(`/schema?connectionId=${encodeURIComponent(connectionId)}`),
  listConnections: () => get('/connections'),
  healthCheck: () => get('/health'),
};

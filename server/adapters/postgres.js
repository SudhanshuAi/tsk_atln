import pg from 'pg';
const { Pool } = pg;

export async function connect({ host, port, user, password, database }) {
  const pool = new Pool({
    host,
    port: parseInt(port) || 5432,
    user,
    password,
    database,
    max: 5,
    connectionTimeoutMillis: 10000,
  });
  // Test the connection
  const client = await pool.connect();
  client.release();
  return pool;
}

export async function runQuery(pool, sql) {
  const startTime = Date.now();
  try {
    const result = await pool.query(sql);
    const executionTime = (Date.now() - startTime) / 1000;

    if (!result.fields || result.fields.length === 0) {
      return {
        columns: [],
        rows: [],
        rowsAffected: result.rowCount ?? 0,
        executionTime,
        message: `Query OK, ${result.rowCount ?? 0} row(s) affected`,
      };
    }

    const columns = result.fields.map((f) => f.name);
    const normalizedRows = result.rows.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        const val = row[col];
        obj[col] = val instanceof Date ? val.toISOString().slice(0, 10) : val;
      });
      return obj;
    });

    return { columns, rows: normalizedRows, rowsAffected: result.rowCount, executionTime };
  } catch (err) {
    return { error: err.message };
  }
}

export async function getSchema(pool) {
  const tablesRes = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  );

  const schema = [];
  for (const { table_name } of tablesRes.rows) {
    const colsRes = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
      [table_name]
    );
    schema.push({
      tableName: table_name,
      columns: colsRes.rows.map((c) => ({
        name: c.column_name,
        type: c.data_type.toUpperCase().replace(' WITHOUT TIME ZONE', '').replace(' WITH TIME ZONE', ''),
      })),
    });
  }
  return schema;
}

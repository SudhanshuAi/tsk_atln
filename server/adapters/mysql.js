import mysql from 'mysql2/promise';

export async function connect({ host, port, user, password, database }) {
  const pool = mysql.createPool({
    host,
    port: parseInt(port) || 3306,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    connectTimeout: 10000,
  });
  // Test the connection
  const conn = await pool.getConnection();
  conn.release();
  return pool;
}

export async function runQuery(pool, sql) {
  const startTime = Date.now();
  try {
    const [rows, fields] = await pool.query(sql);
    const executionTime = (Date.now() - startTime) / 1000;

    // Handle non-SELECT statements (INSERT, UPDATE, DELETE, CREATE, etc.)
    if (!Array.isArray(rows)) {
      return {
        columns: [],
        rows: [],
        rowsAffected: rows.affectedRows ?? 0,
        executionTime,
        message: `Query OK, ${rows.affectedRows ?? 0} row(s) affected`,
      };
    }

    const columns = fields ? fields.map((f) => f.name) : [];
    const normalizedRows = rows.map((row) => {
      const obj = {};
      columns.forEach((col) => {
        const val = row[col];
        obj[col] = val instanceof Date ? val.toISOString().slice(0, 10) : val;
      });
      return obj;
    });

    return { columns, rows: normalizedRows, rowsAffected: rows.length, executionTime };
  } catch (err) {
    return { error: err.message };
  }
}

export async function getSchema(pool) {
  const [tables] = await pool.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME`
  );

  const schema = [];
  for (const { TABLE_NAME } of tables) {
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
      [TABLE_NAME]
    );
    schema.push({
      tableName: TABLE_NAME,
      columns: cols.map((c) => ({ name: c.COLUMN_NAME, type: c.DATA_TYPE.toUpperCase() })),
    });
  }
  return schema;
}

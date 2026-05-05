import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: import.meta.env.MYSQL_HOST || process.env.MYSQL_HOST,
  user: import.meta.env.MYSQL_USER || process.env.MYSQL_USER,
  password: import.meta.env.MYSQL_PASSWORD || process.env.MYSQL_PASSWORD,
  database: import.meta.env.MYSQL_DATABASE || process.env.MYSQL_DATABASE,
  port: parseInt(import.meta.env.MYSQL_PORT || process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

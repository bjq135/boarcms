const mysql = require('mysql2');
const config = require('../config.js');

var pool;

/**
 * 获取一个数据库连接，需要手动关闭 connection.end()
 */
async function getConnection() {
  let connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.username,
    password: config.database.password,
    charset: 'utf8',
    namedPlaceholders: true
  }).promise();

  return connection;
}


/**
 * 获取一个数据库连接池
 */
function getPool() {
  if (pool === undefined) {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.username,
      password: config.database.password,
      charset: 'utf8',
      waitForConnections: true, //true 连接排队等待可用连接；false 立即抛出错误
      connectionLimit: 3, //单次可创建最大连接数
      queueLimit: 0, //连接池的最大请求数
      namedPlaceholders: true
    }).promise();
  }
  return pool;
}


/**
 * 从连接池里获取一个连接
 * 注意：需要手动 conn.release()，否则会使 pool 满载无法响应
 */
async function getPoolConnection() {
  pool = getPool();
  let conn = await pool.getConnection();
  return conn;
}


/**
 * 查询函数，如果需要 SQL 预处理。需要使用 execute 函数
 * @param {string} sql
 * @param {array} values 可选
 * @returns Promise
 */
function query(sql, values) {
  pool = getPool();
  return pool.query(sql, values);
};


/**
 * 查询函数，有 SQL 预处理。execute 将在内部调用 prepare 和 query
 * @param {string} sql 
 * @param {array} values 可选
 * @returns Promise
 */
function execute(sql, values) {
  pool = getPool();
  return pool.execute(sql, values);
};


module.exports = {
  getConnection,
  getPool,
  getPoolConnection,
  query,
  execute
};

const dbUtil = require('../../utils/db.js');
const htmlUtil = require('../../utils/html.js');
const commonUtil = require('../../utils/common.js');


async function index(req, res) {
  let data = {};

  let sql = `SELECT count(id) AS count FROM tb_article`;
  let [rows] = await dbUtil.query(sql);
  data.articleCounter = rows[0].count;

  sql = `SELECT count(id) AS count FROM tb_category`;
  [rows] = await dbUtil.query(sql);
  data.categoryCounter = rows[0].count;

  sql = `SELECT count(id) AS count FROM tb_page`;
  [rows] = await dbUtil.query(sql);
  data.pageCounter = rows[0].count;

  sql = `SELECT count(id) AS count FROM tb_user`;
  [rows] = await dbUtil.query(sql);
  data.userCounter = rows[0].count;

  // sql = `SELECT * FROM tb_unload ORDER BY id DESC LIMIT 15 `;
  // [rows] = await dbUtil.query(sql);
  // data.unload = res;

  // sql = `SELECT count(id) AS counter FROM tb_unload`;
  // [rows] = await dbUtil.query(sql);
  // data.unloadCounter = rows[0].counter;

  // sql = `SELECT count(id) AS counter FROM tb_unload WHERE DATE(created_at)=CURDATE()`;
  // [rows] = await dbUtil.query(sql);
  // data.todayUnloadCounter = rows[0].counter;

  res.render('admin/index.html', data);
  // res.send('ssss');
  // return;
}


module.exports = { index };

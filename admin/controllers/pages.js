const dbUtil = require('../../utils/db.js');
const pagination = require("../../utils/page-number/index.js");


async function index(req, res) {
  let page = req.query.page ? req.query.page : 1;
  let perPage = 13;

  const data = {};

  let start = (page - 1) * perPage;
  let sql = `SELECT * FROM tb_page ORDER BY id DESC LIMIT :per_page OFFSET :start`;
  let [rows, fields] = await dbUtil.query(sql, { per_page: perPage, start: start });
  data.pages = rows;

  sql = `SELECT count(id) AS counter FROM tb_page`;
  [rows, fields] = await dbUtil.query(sql);
  let count = rows[0].counter;

  const pager = pagination(req, page, count, perPage);
  data.pager = pager;
  // return ctx.body = data;
  res.render('admin/pages/index.html', data);
}

async function create(req, res) {
  // return ctx.body = "create";
  res.render('admin/pages/create.html');
}

async function edit(req, res) {
  let id = req.params.id;

  let sql = 'SELECT * FROM tb_page WHERE id=?';
  let [rows] = await dbUtil.query(sql, [id]);

  // console.log('rows[0] ', rows[0])

  res.render('admin/pages/edit.html', rows[0]);
}

module.exports = {index, create, edit};


const dbUtil = require('../../utils/db.js');
const htmlUtil = require('../../utils/common.js');
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

  const page = rows[0];

  if(page.thumbnail_id){
    let image = await dbUtil.findOne('tb_asset', page.thumbnail_id);
    console.log(image)
    if(image){
      page.thumbnail = htmlUtil.getImageUrl(image.file_path);
    }
  }

  res.render('admin/pages/edit.html', {page});
}

module.exports = {index, create, edit};


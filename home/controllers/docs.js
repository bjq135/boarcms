const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');

const dbUtil = require('../../utils/db.js');
const commonUtil = require('../../utils/common.js');

const siteService = require('../services/site.js');

async function show(req, res) {
  let path = req.params.path;
  let pattern = /^[a-zA-Z]{2,20}$/;

  if(!pattern.exec(path)){
    res.status(400);
    res.json({error:'参数不正确'});
    return;
  }
  
  let sql = `SELECT * FROM tb_doc WHERE path=:path`;
  let [rows] = await dbUtil.execute(sql, {path:path});
  if(rows[0] === undefined){
    res.status(400);
    res.json({error:'没有找到文档'});
    return;
  }
  
  var data = {};
  data.doc = rows[0];
  
  // 生成目录html字符串
  sql = `SELECT d.article_id as id, d.parent_id, doc_id, a.title FROM tb_doc_item as d
            LEFT JOIN tb_article AS a ON a.id=d.article_id
            WHERE d.doc_id=:doc_id ORDER by d.list_order DESC,d.id ASC`;
  let [list] = await dbUtil.execute(sql, {doc_id: data.doc.id});
  list = list.map( (item, index) => {
    item.url = '/articles/' + item.id;
    return item;
  });
  let arr = commonUtil.getChildrenTree(list, 0);

  data.menus = commonUtil.makeMenu(arr);

  let loginUserId = req.app.locals.loginUserId ? req.app.locals.loginUserId : 0;
  data.site = await siteService.getSite(loginUserId);
  
  res.render('home/docs-index.html', data);
}


async function index(req, res){
  let sql, rows;
  const data = {};

  sql = `SELECT * FROM tb_doc`;
  [rows] = await dbUtil.execute(sql);
  data.list = rows;

  let loginUserId = req.app.locals.loginUserId ? req.app.locals.loginUserId : 0;
  data.site = await siteService.getSite(loginUserId);
  
  res.render('home/docs.html', data);
}


module.exports = {
  show,
  index
};

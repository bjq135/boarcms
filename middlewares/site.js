const htmlUtil = require('../utils/html.js');
const dbUtil = require('../utils/db.js');

const config = require('../config.js');
const configHome = require('../home/controllers/config.home.js');

const TagsService = require('../home/services/tags.js');
const tagsService = new TagsService();

const ArticlesService = require('../home/services/articles.js');
const articlesService = new ArticlesService();

const DocsService = require('../home/services/docs.js');
const docsService = new DocsService();

module.exports = async function (req, res, next) {
  // req.state = {};
  req.app.locals.host = req.hostname;
  req.app.locals.siteUrl = config.siteUrl;

  // 夜间模式
  req.app.locals.darkMode = req.cookies.darkMode == 1 ? true : false;

  // 登录状态
  req.app.locals.isLogin = req.userId ? req.userId : null;

  // 网站菜单
  req.app.locals.homeMenuHtmlString = htmlUtil.getMenuHtml(configHome.nav);
  req.app.locals.homeMenuHtmlStringPC = htmlUtil.getMenuHtmlPc(configHome.nav);
  req.app.locals.tags = await tagsService.getTags();
  
  // 用户信息
  let articleCounter = await articlesService.getAllArticleCounter();
  let docsCounter = docsService.getDocsCounter();
  
  let sql = `SELECT count(*) AS count FROM tb_article_to_category AS ac
              LEFT JOIN tb_article AS a ON ac.article_id=a.id
              WHERE ac.category_id=50 AND a.is_show=1`;
  let [rows] = await dbUtil.execute(sql);
  let projectCounter = rows[0]['count'];
  req.app.locals.count = {articleCounter, docsCounter, projectCounter};

  // 模版 
  req.app.locals.htmlUtil = htmlUtil;
  req.app.locals.req = req;

  req.app.locals.siteOption = config.siteOption;

  next();
}

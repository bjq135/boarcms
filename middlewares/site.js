const htmlUtil = require('../utils/html.js');

const config = require('../config.js');
const configHome = require('../app/home/controllers/config.home.js');

const TagsService = require('../app/articles/services/tags.js');
const tagsService = new TagsService();

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

  // 模版 
  req.app.locals.htmlUtil = htmlUtil;
  req.app.locals.req = req;

  req.app.locals.siteOption = config.siteOption;

  next();
}

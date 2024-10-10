const htmlUtil = require('../utils/html.js');
const dbUtil = require('../utils/db.js');

const config = require('../config.js');
const configHome = require('../home/controllers/config.home.js');

const admin = require('../admin/services/admin.js');

module.exports = async function (req, res, next) {
  // req.state = {};
  req.app.locals.host = req.hostname;
  req.app.locals.siteUrl = config.siteUrl;

  // 夜间模式
  req.app.locals.darkMode = req.cookies.darkMode == 1 ? true : false;

  // 登录状态
  req.app.locals.isLogin = req.userId ? req.userId : null;

  // 模版 
  req.app.locals.htmlUtil = htmlUtil;
  req.app.locals.req = req;

  req.app.locals.siteOption = config.siteOption;
  req.app.locals.admin = admin;

  next();
}

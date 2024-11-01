const os = require('node:os');
const process = require('node:process');

const commonUtil = require('../utils/common.js');

const express = require("express");
const router = express.Router();

const auth = require('../middlewares/auth.js');
router.use(auth.authInit);

const admin = require('../middlewares/admin.js');
router.use(admin);

router.get('/login', async (req, res)=>{ res.render('admin/login.html');});
router.get('/login-out', async (req, res)=>{ req.session.userId = undefined; res.redirect('/');});

// 用户
const usersController = require('./controllers/users.js');
router.get(`/admin/users`, auth.check, usersController.index);
router.get(`/admin/users/codes`, auth.check, usersController.codes);
router.get(`/admin/users/logs`, auth.check, usersController.logs);

// 后台首页
const adminController = require('./controllers/admin.js');
router.get(`/admin/index`, auth.check, adminController.index);

// 文章
const articlesController = require('./controllers/articles.js');
router.get(`/admin/articles`, auth.check, articlesController.index);
router.get(`/admin/articles/create`, auth.check, articlesController.create);
router.get(`/admin/articles/:id/edit`, auth.check, articlesController.edit);

// 分类
const categoriesController = require('./controllers/categories.js');
router.get(`/admin/categories`, auth.check, categoriesController.index);
router.get(`/admin/categories/create`, auth.check, categoriesController.create);
router.get(`/admin/categories/:id/edit`, auth.check, categoriesController.edit);

// 页面
const pagesController = require('./controllers/pages.js');
router.get(`/admin/pages`, auth.check, pagesController.index);
router.get(`/admin/pages/create`, auth.check, pagesController.create);
router.get(`/admin/pages/:id/edit`, auth.check, pagesController.edit);

// 标签
const tagsController = require('./controllers/tags.js');
router.get(`/admin/tags`, auth.check, tagsController.index);
router.get(`/admin/tags/create`, auth.check, tagsController.create);
router.get(`/admin/tags/:id/edit`, auth.check, tagsController.edit);

// 资源
const assetsController = require('./controllers/assets.js');
router.get(`/admin/images`, auth.check, assetsController.index);

// 站点设置
const siteController = require('./controllers/site.js');
router.get(`/admin/site`, auth.check, siteController.index);


module.exports = router;

const i18n = require('i18n');

const commonUtil = require('../../utils/common.js');
const dbUtil = require('../../utils/db.js');
const htmlUtil = require('../../utils/html.js');
const pagination = require('../../utils/page-number/index.js');

const ArticlesService = require('../services/articles.js');
const CategoriesService = require('../services/categories.js');
const TagsService = require('../services/tags.js');

const siteService = require('../services/site.js');

async function show(req, res) {
  const data = {};
  data.site = await siteService.getSite(req.app.locals.loginUserId);

  let id = req.params.id ? parseInt(req.params.id) : 0;

  var articlesService = new ArticlesService();
  var categoriesService = new CategoriesService();
  
  
  var article = await articlesService.getArticleById(id);

  if (article == null) {
    res.status(404);
    res.render("home/404.html", data);
    return;
  }
  
  // 未登录用户看不到隐藏文章
  if (req.session.userId == undefined && article.is_show == 0) {
    res.status(404);
    res.render("home/404.html", data);
    return;
  }
  
  article = commonUtil.dataShow(article);
  article.user.avatar = htmlUtil.getAvatarUrl(article.user.avatar);

  article['thumbnail'] = commonUtil.getImageUrl(article['thumbnail']);
  article['created_at'] = commonUtil.formatDate(Date.parse(article['created_at']));
  article['updated_at'] = article.updated_at ? commonUtil.formatDate(Date.parse(article.updated_at)) : '';
  data.article = article;

  // 获取分类
  data.allCategories = await categoriesService.getAllCategories();
  data.currentCategories = await categoriesService.getCategoriesByArticleId(article.id);

  // 获取 tags
  const tagsService = new TagsService();
  data.article.tags = await tagsService.getTagsByArticleId(id);

  // 更新文章浏览数
  article.hit_counter = parseInt(article.hit_counter) + 1;
  let sql = `UPDATE tb_article SET hit_counter=? WHERE id=?`;
  await dbUtil.execute(sql, [article.hit_counter, article.id]);

  // 网站关键词和描述
  data.keywords = req.app.locals.keywords;
  data.description = article['content'];
  data.description = commonUtil.delHtmlTag(data.description);
  data.description = data.description.replace(/"/g, ' ');
  data.description = data.description.replace(/\n/g, ' ');
  data.description = String(data.description).slice(0, 300);

  // 上一篇文章和下一篇文章导航
  sql = `SELECT a.id, a.title, a.created_at
          FROM tb_article AS a, tb_article_to_category AS cat
          WHERE a.id<? AND a.is_show=1 AND cat.category_id != 50 AND cat.article_id=a.id
          ORDER BY a.id DESC LIMIT 1`;
  let [rows] = await dbUtil.execute(sql, [article.id]);
  if (rows[0]) {
    data.prev = rows[0];
    data.prev.created_at = commonUtil.formatDate(new Date(rows[0].created_at));
  } else {
    data.prev = null;
  }
  
  sql = `SELECT a.id, a.title, a.created_at
          FROM tb_article AS a, tb_article_to_category AS cat
          WHERE a.id>? AND a.is_show=1 AND cat.category_id != 50 AND cat.article_id=a.id
          ORDER BY a.id DESC LIMIT 1`;
  [rows] = await dbUtil.execute(sql, [article.id]);
  if (rows[0]) {
    data.next = rows[0];
    data.next.created_at = commonUtil.formatDate(new Date(rows[0].created_at));
  } else {
    data.next = null;
  }

  // 所属文档
  sql = `SELECT 
            di.id, di.doc_id,
            (SELECT d.title FROM tb_doc AS d WHERE d.id=di.doc_id) AS title, 
            (SELECT d.thumbnail FROM tb_doc AS d WHERE d.id=di.doc_id) AS thumbnail,
            (SELECT d.path FROM tb_doc AS d WHERE d.id=di.doc_id) AS path
        FROM tb_doc_item AS di 
        WHERE article_id=?`;
  [rows] = await dbUtil.execute(sql, [article.id]);
  data.doc = rows[0];
  
  let loginUserId = req.app.locals.loginUserId ? req.app.locals.loginUserId : 0;
  data.site = await siteService.getSite(loginUserId);

  res.render("home/article.html", data);
}



module.exports = { show };

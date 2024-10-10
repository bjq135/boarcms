const i18n = require('i18n');

const UsersService = require("../services/users.js");
const ArticlesService = require("../services/articles.js");
// const ArticlesMetaService = require("../services/articles-meta.js");
const CategoriesService = require("../services/categories.js");
const TagsService = require("../services/tags.js");
const pagination = require("../../utils/page-number/index.js");
const htmlUtil = require("../../utils/html.js");
const commonUtil = require("../../utils/common.js");

const config = require("../../config.js");


/**
 * 文章列表页
 */
async function index(req, res) {
  const data = {};

  let page = req.query.page ? parseInt(req.query.page) : 1; // 页码
  let perPage =  15; // 每页条
  let categoryId = req.query.category_id ? parseInt(req.query.category_id) : 0; // 分类ID

  data.is_show = req.query.is_show ? req.query.is_show : 2;;
  data.keyword = req.query.keyword ? req.query.keyword : '';

  // 获取所有分类列表
  const articlesService = new ArticlesService();
  const categoriesService = new CategoriesService();
  const allCategories = await categoriesService.getAllCategories();
  data.options = htmlUtil.getOptions(0, allCategories, '&nbsp;', categoryId);

  // 获取分类下的文章
  var currentCategoryIds = await categoriesService.getCategoryChildrenIds(categoryId, allCategories);
  var articles = await articlesService.getArticles(currentCategoryIds, page, perPage, data.is_show, data.keyword);
  for (let i = 0; i < articles.length; i++) {
    articles[i].categories = await categoriesService.getCategoriesByArticleId(articles[i].id);
  }

  // 分页
  let counter = await articlesService.getArticleCounter(currentCategoryIds, perPage, data.is_show, data.keyword);
  let pager = pagination(req, page, counter, perPage);
  data.list = articles;
  data.pager = pager;
  data.categoryId = categoryId;
  // res.json(data);
  res.render('admin/articles/index.html', data);
}


async function show(req, res) {
  return ctx.body = "show";
}

/**
 * 文章新建页
 */
async function create(req, res) {
  const categoriesService = new CategoriesService();
  var categories = await categoriesService.getAllCategories();
  var categoriesHTML = htmlUtil.getManyCategory(0, categories, '&nbsp;', [], 'categories');
  
  const tagsServices = new TagsService();
  let tags = await tagsServices.getTags();

  let data = { categoriesHTML, tags };
  res.render('admin/articles/create.html', data);
  return;
}


/**
 * 文章编辑页
 */
async function edit(req, res) {
  // 获取文章内容
  var id = parseInt(req.params.id);
  const articlesService = new ArticlesService();
  var article = await articlesService.getArticleById(id);

  if(!article){
    res.status(404).json({error: i18n.__(404)});
    return;
  }

  article.created_at = commonUtil.formatDateTime(new Date(article.created_at).getTime());
  article.updated_at = commonUtil.formatDateTime(new Date(article.updated_at).getTime());

  const categoriesService = new CategoriesService();
  var categories = await categoriesService.getAllCategories();
  var categoryIds = await categoriesService.getCategoriesByArticleId(article.id);
  categoryIds = categoryIds.map(c => c.category_id);
  
  var categoriesHTML = htmlUtil.getManyCategory(0, categories, '&nbsp;', categoryIds, 'categories');

  const tagsServices = new TagsService();
  let tags = await tagsServices.getTags();
  let currentTags = await tagsServices.getTagsByArticleId(id);
  if( currentTags ){
    let currentTagIds = currentTags.map(item => item.id);
    tags.forEach((item, index)=>{
      tags[index].active = currentTagIds.indexOf(item.id) === -1 ? false : true; 
    });
  }
  
  const meta = config.articleMeta;
  if (Array.isArray(meta)) {
    const articlesMetaService = new ArticlesMetaService();
    for (let i = 0; i < meta.length; i++) {
      let r = await articlesMetaService.getArticleMeta(id, meta[i].meta_key);
      meta[i].meta_value = r?.meta_value;
    }
  }
  
  let data = { article, categoriesHTML, tags, meta };
  res.render('admin/articles/edit.html', data);
  return;
}


module.exports = {index, show, create, edit};

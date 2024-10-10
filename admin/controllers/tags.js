const ArticlesService = require('../services/articles.js');
const TagsService = require('../services/tags.js');
const pagination = require("../../utils/page-number/index.js");


async function index(req, res) {
  let page = req.query.page > 0 ? parseInt(req.query.page) : 1;
  let perPage = 15;

  const tagsService = new TagsService();
  const tags = await tagsService.getTagsPage(page, perPage);
  const count = await tagsService.getTagsCount();

  const pager = pagination(req, page, count, perPage);
  const data = { tags, pager };
  
  res.render('admin/tags/index.html', data);
}

async function create(req, res) {
  res.render('admin/tags/create.html');
}

async function edit(req, res) {
  const tagsService = new TagsService();
  const tags = await tagsService.get(req.params.id);
  console.log(tags);
  res.render('admin/tags/edit.html', tags);
}

module.exports = {index, create, edit};

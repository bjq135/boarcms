const dbUtil = require('../../utils/db.js');
const htmlUtil = require('../../utils/html.js');
const commonUtil = require('../../utils/common.js');
const Dao = require('../../utils/dao.js');

const CategoriesService = require('../services/categories.js');

async function index(req, res) {
  const categoriesService = new CategoriesService();
  var categories = await categoriesService.getAllCategories();
  
  //菜单列表html
  var menus = '';

  function GetData(id, arry, nbsp) {
    var space = nbsp;
    nbsp += nbsp;
    var childArry = GetParentArry(id, arry);
    var icon = (id == 0) ? '' : ' ├ ';
    if (childArry.length > 0) {
      for (var i in childArry) {
        menus += '<tr>';
        menus += '<td>\
        <input type="text" name="list_orders" size="3" value="' + childArry[i].list_order + '">\
        <input type="hidden" name="id_arr" size="3" value="' + childArry[i].id + '">\
        </td>';
        menus += '<td>' + childArry[i].id + '</td>';
        menus += '<td>' + space + icon + childArry[i].title + '</td>';
        if (childArry[i].is_show) {
          menus += '<td><span class="text-success">显示</span></td>';
        } else {
          menus += '<td><span class="text-danger">隐藏</span></td>';
        }
        menus += '<td>';
        menus += '<a  class="btn btn-success btn-sm" href="/admin/categories/create?parent_id=' + childArry[i].id + '">添加</a> ';
        menus += '<a  class="btn btn-primary btn-sm" href="/admin/categories/' + childArry[i].id + '/edit">编辑</a> ';
        menus += '<a  class="btn btn-danger btn-sm ajax-url" data-method="delete" data-message="确定要删除“' + childArry[i].title + '”吗？" data-url="/v1/categories/' + childArry[i].id + '">删除</a> ';
        menus += '</td>';
        menus += '</tr>';
        GetData(childArry[i].id, arry, nbsp);
      }
    }
  }

  function GetParentArry(id, arry) {
    var newArry = new Array();
    for (var i in arry) {
      if (arry[i].parent_id == id)
        newArry.push(arry[i]);
    }
    return newArry;
  }

  GetData(0, categories, '&nbsp;');

  res.render('admin/categories/index.html', { menus });
}

/**
 * 显示创建页面
 */
async function create(req, res) {
  let parentId = req.query.parent_id ? req.query.parent_id : 0;

  const categoriesService = new CategoriesService();
  let categories = await categoriesService.getAllCategories();
  let options = htmlUtil.getOptions(0, categories, '&nbsp;', parentId);

  res.render('admin/categories/create.html', { options, commonUtil });
}

/**
 * 创建   
 */
async function store(req, res) {
  ctx.body = "保存";
  // commonUtil.formatDateTime(Date.now())
  // let categoriesServices = new CategoriesService();
}

/**
 * 编辑页面
 */
async function edit(req, res) {
  let categoryId = parseInt(req.params.id);
  
  const categoriesService = new CategoriesService();
  // const imagesService = new ImagesService();
  let category = await categoriesService.getCategoryById(categoryId);
  if(category.thumbnail_id){
    const imagesDao = new Dao('tb_asset');
    const image = await imagesDao.findOne(category.thumbnail_id);
    category.thumbnail = commonUtil.getImageUrl(image.file_path);
  }

  let categories = await categoriesService.getAllCategories();
  let options = htmlUtil.getOptions(0, categories, '&nbsp;', category.parent_id);
  res.render('admin/categories/edit.html', { category: category, options, commonUtil });
}


module.exports = {index, create, store, edit};


const Dao = require('../../utils/dao.js');
const pagination = require("../../utils/page-number/index.js");
const htmlUtil = require('../../utils/html.js');
const commonUtil = require('../../utils/common.js');

const UsersService = require('../services/users.js');

async function index(req, res) {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = 15;
  let start = perPage * (page - 1);
  
  const assetDao = new Dao('tb_asset');
  const obj = {
    limit:perPage,
    offset:start,
    order:{id:'desc'}
  };
  
  const images = await assetDao.findAll(obj);
  const usersService = new UsersService();
  for (let i = 0; i < images.length; i++) {
    images[i].url = htmlUtil.getImageUrl(images[i].file_path);
    images[i].created_at = commonUtil.formatDateTime(new Date(images[i].created_at).getTime());
    images[i].user = await usersService.getPublicUserInfo(images[i].user_id);
    let avatarItem = await assetDao.findOne(images[i].user.avatar);
    console.log('avatarItem',avatarItem)
    images[i].user.avatar = htmlUtil.getAvatarUrl(avatarItem.file_path);
  }

  // 分页
  let counter = await assetDao.findAllCounter(obj);
  let pager = pagination(req, page, counter, perPage);
  let data = { list: images, pager };

  res.render('admin/assets/images.html', data);
}


module.exports = { index };

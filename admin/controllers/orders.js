const pagination = require("../../utils/page-number/index.js");
const htmlUtil = require("../../utils/html.js");
const commonUtil = require("../../utils/common.js");
const config = require("../../config.js");

const OrdersService = require('../mall/orders.js');
const dbUtil = require("../../utils/db.js");

async function index(ctx) {
  let data = {};
  let page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1; // 页码
  let perPage = 20; // 每页条

  let statusArray = ['未付款', '已付款', '已发货', '已签收', '退货申请', '退货中', '已退货', '取消交易'];
  const ordersService = new OrdersService();
  data.list = await ordersService.getOrders(page, perPage, ctx.request.query.keyword, ctx.request.query.status);
  data.list = data.list.map(item => {
    item.created_at = commonUtil.formatDateTime(new Date(item.created_at).getTime());
    item.statusText = statusArray[item.status];
    return item;
  });

  let counter = await ordersService.getOrdersCounter(ctx.request.query.keyword, ctx.request.query.status);
  data.pager = pagination(ctx.request, page, counter, perPage);

  data.status = ctx.request.query.status;
  data.keyword = ctx.request.query.keyword;
  // ctx.body = "sssds都是错的";
  await ctx.render('admin/orders/index', data);
}


async function edit(ctx) {
  // return ctx.body = "{error:'ssss'}";
  let sql, res, replacements, data = {};
  sql = 'select * from tb_order where id=:id';
  replacements = { id: ctx.params.id };
  console.log('replacements', replacements);

  [res] = await dbUtil.execute(sql, replacements);
  data.order = res[0];

  await ctx.render('admin/orders/edit', data);
}

module.exports = { index, edit };

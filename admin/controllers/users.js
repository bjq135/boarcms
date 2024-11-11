const UsersService = require("../services/users.js");
const LogsService = require("../services/logs.js");
const CodesService = require("../services/codes.js");

const pagination = require("../../utils/page-number/index.js");
const htmlUtil = require("../../utils/html.js");
const commonUtil = require("../../utils/common.js");


async function index(req, res) {
  let page = req.query.page ? parseInt(req.query.page) : 1; // 页码
  let perPage = 15; // req.query.per_page ? parseInt(req.query.per_page) : 20; // 每页条
  let status = req.query.status ? req.query.status : 'all';
  let keyword = req.query.keyword ? req.query.keyword : '';

  const usersService = new UsersService();
  const users = await usersService.getUsers(page, perPage, status, keyword);
  const count = await usersService.getUsersCount(status, keyword);

  const pager = pagination(req, page, count, perPage);
  const data = { keyword, users, pager, status };

  res.render('admin/users/index.html', data);
}


async function show(req, res) {
  return ctx.body = "show";
}


async function edit(req, res) {
  return ctx.body = "edit";
}


/**
 * 日志页
 */
async function logs(req, res) {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = 15;

  const logsService = new LogsService(page, perPage);
  let [rows] = await logsService.getLogs(page, perPage);
  const usersService = new UsersService();
  for (let i = 0; i < rows.length; i++) {
    rows[i].url = htmlUtil.getImageUrl(rows[i].file_path);
    rows[i].created_at = commonUtil.formatDateTime(new Date(rows[i].created_at).getTime());
    if (rows[i].user_id) {
      rows[i].user = await usersService.getPublicUserInfo(rows[i].user_id);
      if (rows[i].user) {
        rows[i].user.avatar = htmlUtil.getAvatarUrl(rows[i].user.avatar);
      }
    }
  }
  // 分页
  let counter = await logsService.getLogsCounter(page, perPage);
  let pager = pagination(req, page, counter, perPage);
  let data = { list: rows, pager };

  res.render('admin/users/logs.html', data);
}


/**
 * 验证码管理页
 */
async function codes(req, res) {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = 15;

  const codesService = new CodesService(page, perPage);
  let [rows] = await codesService.getCodes(page, perPage);
  const usersService = new UsersService();
  for (let i = 0; i < rows.length; i++) {
    rows[i].url = htmlUtil.getImageUrl(rows[i].file_path);
    rows[i].created_at = commonUtil.formatDateTime(new Date(rows[i].created_at).getTime());
    rows[i].expired_at = commonUtil.formatDateTime(new Date(rows[i].expired_at).getTime());
    if (rows[i].user_id) {
      rows[i].user = await usersService.getPublicUserInfo(rows[i].user_id);
      if (rows[i].user) {
        rows[i].user.avatar = htmlUtil.getAvatarUrl(rows[i].user.avatar);
      }
    }
  }
  // 分页
  let counter = await codesService.getCodesCounter(page, perPage);
  let pager = pagination(req, page, counter, perPage);
  let data = { list: rows, pager };

  res.render('admin/users/codes.html', data);
}


module.exports = {index, show, edit, logs, codes};

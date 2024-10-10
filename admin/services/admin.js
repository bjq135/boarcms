const nav = [
    {
      title: "系统首页",
      url: "/admin/index",
      isShow: true,
      icon: "&#xe89a;",
      children: []
    },
    {
      title: "文章",
      url: "javascript:;",
      isShow: true,
      icon: "&#xe8bc;",
      children: [
        { title: "文章", url: "/admin/articles", icon: "&#xe8bc;", isShow: true },
        { title: "添加文章", url: "/admin/articles/create", icon: "&#xe8bc;", isShow: false },
        { title: "编辑文章", route: "/admin/articles/:id/edit", icon: "&#xe8bc;", isShow: false },
        { title: "分类", url: "/admin/categories", icon: "&#xe8bc;", isShow: true },
        { title: "添加分类", url: "/admin/categories/create", icon: "&#xe8bc;", isShow: false },
        { title: "编辑分类", route: "/admin/categories/:id/edit", icon: "&#xe8bc;", isShow: false },
        { title: "页面", url: "/admin/pages", icon: "&#xe8bc;", isShow: true },
        { title: "添加页面", url: "/admin/pages/create", icon: "&#xe8bc;", isShow: false },
        { title: "编辑页面", route: "/admin/pages/:id/edit", icon: "&#xe8bc;", isShow: false },
        { title: "标签", url: "/admin/tags", icon: "&#xe8bc;", isShow: true },
        { title: "编辑页面", route: "/admin/tags/:id/edit", icon: "&#xe8bc;", isShow: false }
      ]
    },
    {
      title: "用户",
      url: "javascript:;",
      isShow: true,
      icon: "&#xe8a5;",
      children: [
        { title: "用户列表", url: "/admin/users", icon: "&#xe78e;", isShow: true },
        { title: "编辑用户", route: "/admin/users/:id/edit", icon: "&#xe78e;", isShow: false },
        { title: "验证码", url: "/admin/users/codes", icon: "&#xe78e;", isShow: true },
        { title: "日志", url: "/admin/users/logs", icon: "&#xe78e;", isShow: true }
      ]
    },
    {
      title: "附件",
      url: "javascript:;",
      isShow: true,
      icon: "&#xe751;",
      children: [
        { title: "图片", url: "/admin/images", icon: "&#xe751;", isShow: true },
        // { title: "幻灯片", url: "/admin/sliders", icon: "&#xe7b1;", isShow: true },
        { title: "添加幻灯片", url: "/admin/sliders/create", icon: "&#xe751;", isShow: false },
        { title: "编辑幻灯片", route: "/admin/sliders/:id/edit", icon: "&#xe751;", isShow: false },
        { title: "订单", url: "/admin/orders", icon: "&#xe751;", isShow: false }
      ]
    },
    {
      title: "退出",
      url: "/login-out",
      isShow: true,
      icon: "&#xe749;",
      children: []
    }
  ];


/**
 * 获取菜单数组
 * @param  req 
 * @returns Array
 */
function getAdminNav(req) {
  var navShow = [];

  // 一级目录
  for (var item of nav) {
    item.isActive = false;
    // 二级目录
    var temp = [];
    for (let i of item.children) {
      i.isActive = false;
      // console.log(i);
      var path = req.route ? req.route.path : '';
      if (i.url == path || i.route == path) {
        i.isActive = true;
        item.isActive = true; // 设置父节点
      }
      temp.push(i);
    }
    item.children = temp;
    navShow.push(item);
  }
  return navShow;
}


module.exports = { nav, getAdminNav };





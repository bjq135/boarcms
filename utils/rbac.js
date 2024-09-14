/**
 * RBAC
 * 
 * 用户角色关系存储在 tb_user_meta, meta_key='role', meta_value 名字
 */
const dbUtil = require('./db.js');

const rbac = {
  roles: ['superadmin', 'admin', 'user', 'guest'],
  permissions: [
    { permission: 'admin.user.show', title: '查看用户' },
    { permission: 'admin.user.store', title: '添加用户' },
    { permission: 'admin.user.update', title: '修改用户' },
    { permission: 'admin.user.destory', title: '删除用户' },
    { permission: 'article.private.view', title: '查看加密文章' }
  ],
  grants: {
    superadmin: [],
    admin: [
      'admin.user.show',
      'admin.user.store',
      'admin.user.update',
      'admin.user.destory',
      'article.private.view'
    ],
    user: [],
    guest: [],
  },
}

/**
 * 获取一个用户所属角色
 * @param {Object} userId 用户ID
 */
async function getRoles(userId){
  let sql = "SELECT * FROM tb_user_meta WHERE user_id=? AND meta_key='role'";
  let [res] = await dbUtil.execute(sql, [userId]);
  let roles = res.map((item, index)=>{
    return item.meta_value
  });
  return roles;
}

/**
 * 获取一个用户所有角色权限的并集
 * @param {Object} userId 用户ID
 */
async function getPermission(userId){
  let roles = await getRoles(userId);
  let permissions = [];
  roles.forEach((item,index)=>{
    permissions = permissions.concat(rbac.grants[item]);
  });
  return permissions;
}

/**
 * 判断一个角色是否有某个权限
 * @param {Object} roleName 角色名
 * @param {Object} permission 标记
 */
async function roleCan(roleName, permission){
  let permissions = rbac.grants[roleName];
  if(permissions == undefined){
    return false;
  }
  return permissions.indexOf(permission) == '-1' ? false : true;
}

/**
 * 判断一个用户是否有某个权限
 * @param {Object} userId 用户ID
 * @param {Object} permission 标记
 */
async function can(userId, permission){
  let rolePermission = await getPermission(userId);
  console.log('rolePermission', rolePermission);
  console.log('rolePermission.indexOf(permission)', rolePermission.indexOf(permission));
  return rolePermission.indexOf(permission)=='-1' ? false : true;
}

module.exports = {
  getRoles,
  getPermission,
  roleCan,
  can
}

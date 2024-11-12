const i18n = require('i18n');

const config = require('../../config.js');

const htmlUtil = require('../../utils/html.js');
const commonUtil = require('../../utils/common.js');
const dbUtil = require('../../utils/db.js');
const Dao = require('../../utils/dao.js');


class ArticlesService {
  allCategories = [];
  
  constructor() {

  }
  
  
  async store(data){
    const { meta } = data;

    let conn = await dbUtil.getPoolConnection();
    try {
      await conn.query(`START TRANSACTION`);
    
      // 1.插入文章表
      const articlesDao = new Dao('tb_article', conn);
      let results = await articlesDao.save(data);
      if (results.affectedRows == 0) {
        throw new Error(i18n.__('create failed'));
      }
      var articleId = results.insertId;    
    
      // 2.删除所有文章分类关系表所有相关记录
      let sql = "DELETE FROM tb_article_to_category WHERE article_id=:article_id";
      [results] = await conn.execute(sql, { article_id: articleId });
    
      // 3.检查分类是否合法
      sql = 'SELECT id FROM tb_category WHERE FIND_IN_SET(id, ?)';
      [results] = await conn.execute(sql, [data.categories]);
      let categories = data.categories.split(',');
      if (results.length != categories.length || categories.length == 0) {
        throw new Error(i18n.__('category_id_is_not_valid'));
      }
    
      // 4.批量添加文章分类关系
      sql = `INSERT INTO tb_article_to_category (article_id, category_id) VALUES (?,?)`;
      for (let i = 0; i < categories.length; i++) {
        [results] = await conn.execute(sql, [articleId, categories[i]]);
      }
    
      // 5.处理 tags
      if (data.tags) {
        let tagsArr = data.tags.split(',');
        
        sql = "INSERT INTO tb_article_to_tag (article_id, tag_id) VALUES (:article_id, :tag_id)";
        for (let i = 0; i < tagsArr.length; i++) {
          let replacement = {article_id:articleId, tag_id:tagsArr[i]};
          await conn.execute(sql, replacement);
        }
      }

      // 6.处理 meta
      if (meta) {
        const articlesMetaDao = new Dao('tb_article_meta', conn);
        for (const key in meta) {
          await articlesMetaDao.save({ article_id:articleId, meta_key:key, meta_value:meta[key] });
        }
      }
    
      await conn.query(`COMMIT`);

      const article = await this.getArticleById(articleId);
      return article;

    } catch (error) {
      await conn.query(`ROLLBACK`);
      throw error;

    } finally {
      conn.release();
    }
  }


  async update(data){
    const { user_id, meta } = data;
    delete data.user_id;

    let conn = await dbUtil.getPoolConnection();
    try {
      await conn.query(`START TRANSACTION`);

      // 1.更新文章表
      const articlesDao = new Dao('tb_article', conn);
      let results = await articlesDao.update(data);
      if (results.affectedRows == 0) {
        throw new Error(i18n.__('article is not exist'));
      }

      // 2.删除文章分类关系表所有相关记录
      let sql = "DELETE FROM tb_article_to_category WHERE article_id=:article_id";
      [results] = await conn.execute(sql, { article_id: data.id });

      // 3.检查分类是否合法
      sql = 'SELECT id FROM tb_category WHERE FIND_IN_SET(id, ?)';
      [results] = await conn.execute(sql, [data.categories]);
      let categories = data.categories.split(',');
      if (results.length != categories.length || categories.length == 0) {
        throw new Error(i18n.__('category id is not valid'));
      }

      // 4.批量添加文章分类关系
      sql = `INSERT INTO tb_article_to_category (article_id, category_id) VALUES (?,?)`;
      for (let i = 0; i < categories.length; i++) {
        [results] = await conn.execute(sql, [data.id, categories[i]]);
      }

      // 5.处理 tags
      if (data.tags) {
        let tagsArr = data.tags.split(',');
        // tagsArr = tagsArr.filter(t => t.trim() ? true : false);
        sql = "DELETE FROM tb_article_to_tag WHERE article_id=?"
        await conn.execute(sql, [data.id]);
        
        sql = "INSERT INTO tb_article_to_tag (article_id, tag_id) VALUES (:article_id, :tag_id)";
        for (let i = 0; i < tagsArr.length; i++) {
          let replacement = {article_id:data.id, tag_id:tagsArr[i]};
          await conn.execute(sql, replacement);
        }
      }

      // 6.处理 meta
      if (meta) {
        const articlesMetaDao = new Dao('tb_article_meta', conn);
        for (const key in meta) {
          if(meta[key] == null){
            await articlesMetaDao.delete({ where:{ article_id:data.id, meta_key:key }});
            continue;
          }
          let sql = `UPDATE tb_article_meta SET meta_value=? WHERE article_id=? AND meta_key=?`;
          let [result] = await conn.execute(sql, [meta[key], data.id, key]);
          if(result.affectedRows == 0){
            await articlesMetaDao.save({ article_id:data.id, meta_key:key, meta_value:meta[key] });
          }
        }
      }

      await conn.query(`COMMIT`);

      // 7.获取返回信息
      const article = await this.getArticleById(data.id);
      return article;
    } catch (error) {
      await conn.query(`ROLLBACK`);
      throw error;
    } finally {
      conn.release();
    }
  }


  /**
   * 获取文章详情
   * @param {integer} id 文章ID
   * @return {object} 文章对象
   */
  async getArticleById(id) {
    let sql = `SELECT
                a.*,
                u.id AS 'user.id', u.nickname AS 'user.nickname', u.avatar AS 'user.avatar'
              FROM tb_article AS a
              LEFT JOIN tb_user AS u ON u.id = a.user_id
              WHERE a.id=:id`;
    let [rows, fields] = await dbUtil.execute(sql, { id });

    if(rows.length == 0){
      return null;
    }

    var article = rows[0];
    article = commonUtil.dataShow(article);
    
    article.thumbnail_image = '';
    if(article.thumbnail_id){
      sql = `SELECT file_path FROM tb_asset WHERE id=:id`;
      let res = await dbUtil.findOne('tb_asset', {where:{id:article.thumbnail_id}});
      article.thumbnail_image = res ? config.imagePath + "/uploads/images/" + res.file_path : '';
      // [rows] = await dbUtil.execute(sql, {id:article.thumbnail_id});
      // article.thumbnail_image = config.imagePath + "/uploads/images/" + rows[0].file_path;
    }

    const articlesMetaDao = new Dao('tb_article_meta');
    const meta = await articlesMetaDao.findAll({ where:{article_id:id } });
    if(meta && meta.length){
      article.meta = {};
      meta.forEach((item,index)=>{
        article.meta[item.meta_key] = item.meta_value;
      })
    }

    return article;
  }


  /**
   * 通过分类ID数组，获取文章列表
   * @param {array} ids 多个分类ID，比如 12,20,23
   * @param {int} page 页面
   * @param {int} perPage 每页显示条数
   * @param {int} isShow 0,获取所有“隐藏”记录；1,获取状态是“显示”的记录；2, 显示所有记录
   * @param {string} keyword 要搜索的关键词
   * @returns array
   */
  async getArticles(ids, page, perPage, isShow = 2, keyword = '') {
    var sql = ``;
    var replacements = {
      ids: ids.toString(),
      start: perPage * (page - 1),
      perPage
    };

    sql = `
      SELECT 
        a.id,a.user_id,a.title,a.description,a.content,a.more, a.url, a.hit_counter, a.created_at, a.is_show,
        r.*,
        u.id AS 'user.id', u.nickname AS 'user.nickname',
        (SELECT file_path FROM tb_asset AS tb_asset WHERE tb_asset.id=u.avatar) AS 'user.avatar',
        asset.file_path as thumbnail
      FROM tb_article AS a
      LEFT JOIN tb_article_to_category AS r ON r.article_id = a.id
      LEFT JOIN tb_user AS u ON u.id = a.user_id
      LEFT JOIN tb_asset AS asset ON asset.id = a.thumbnail_id
      WHERE FIND_IN_SET(r.category_id, :ids)`;
      
    if (isShow == 1) {
      sql += ` AND a.is_show = 1 `;
    } else if (isShow == 0) {
      sql += ` AND a.is_show = 0 `;
    }
    if (keyword != "") {
      sql += ` AND a.title LIKE CONCAT('%',:keyword,'%') `;
      replacements.keyword = keyword;
    }

    sql += `
      GROUP BY a.id
      ORDER BY a.id DESC
      LIMIT :start,:perPage
    `;

    var [articles] = await dbUtil.execute(sql, replacements);
    articles.forEach(function (a, index) {
      articles[index] = commonUtil.dataShow(a);
      articles[index].user.avatar = htmlUtil.getAvatarUrl(articles[index].user.avatar);
      articles[index].thumbnail = commonUtil.getImageUrl(articles[index].thumbnail);
      // articles[index].more = a.more ? JSON.parse(a.more) : { images: [] };
      articles[index].content = commonUtil.delHtmlTag(a.content);
      articles[index].created_at = commonUtil.formatDate(Date.parse(a.created_at));
      delete articles[index].article_id;
      delete articles[index].category_id;
    });

    return articles;
  }



  /**
   * 通过分类 ids 获取文章总数，供分页使用
   * @param {array} ids 
   * @param {int} perPage 
   * @param {int} isShow 0,获取所有“隐藏”记录；1,获取状态是“显示”的记录；2, 显示所有记录
   * @param {string} keyword 要搜索的关键词
   * @returns int
   */
  async getArticleCounter(ids, perPage, isShow = 2, keyword = '') {
    var replacements = { ids: ids.toString(), perPage };
    
    var sql = `
      SELECT COUNT(id) AS count FROM (
        SELECT id FROM tb_article AS a
        LEFT JOIN tb_article_to_category AS r 
        ON r.article_id = a.id
        WHERE FIND_IN_SET(r.category_id, :ids)`;

    if (isShow == 1) {
      sql += ` AND a.is_show = 1 `;
    } else if (isShow == 0) {
      sql += ` AND a.is_show = 0 `;
    }

    if (keyword != "") {
      sql += ` AND a.title LIKE CONCAT('%',:keyword,'%') `;
    }

    sql += ` 
        GROUP BY a.id
      ) t
    `;

    if (keyword != "") {
      replacements.keyword = keyword;
    }

    var [res, fields] = await dbUtil.execute(sql, replacements);
    var counter = res[0].count;
    return counter;
  }


  /**
   * 获取随机文章
   */
  async getSomeArticle() {
    var lastYear = new Date().getFullYear() - 3;
    var sql = "SELECT * FROM tb_article WHERE is_show=1 AND year(created_at)>:last_year ORDER BY rand() LIMIT 8";
    var [rows] = await dbUtil.execute(sql, { last_year: lastYear });
    return rows;
  }


  /**
   * 通过 tag id 获取文章分页
   * @param  {[integer]} id      tag id
   * @param  {Number} page    页码
   * @param  {Number} perPage 每页条数
   * @param  {Number} isShow  0，隐藏；1，显示；2，所有
   * @return {[array]} 
   */
  async getArticlesByTagId(id, page=1, perPage=15, isShow = 2) {
    let sql = '';
    var replacements = {
      id: id,
      start: perPage * (page - 1),
      perPage
    };

    sql = `SELECT
                att.tag_id, a.*,
                u.id AS 'user.id', u.nickname AS 'user.nickname', u.avatar AS 'user.avatar'
              FROM tb_article_to_tag AS att 
              LEFT OUTER JOIN tb_article AS a ON att.article_id=a.id
              LEFT OUTER JOIN tb_user AS u ON u.id=a.user_id
              WHERE att.tag_id=:id`;
    if (isShow == 1) {
      sql += ` AND a.is_show = 1 `;
    } else if (isShow == 0) {
      sql += ` AND a.is_show = 0 `;
    }

    sql += ` ORDER BY a.list_order DESC, a.id DESC
            LIMIT :start,:perPage`;

    let [articles] = await dbUtil.query(sql, replacements);

    articles.forEach(function (a, index) {
      articles[index] = dbUtil.dataShow(a);
      articles[index].user.avatar = commonUtil.getAvatarUrl(articles[index].user.avatar);
      articles[index].thumbnail = commonUtil.getImageUrl(articles[index].thumbnail);
      // articles[index].more = a.more ? JSON.parse(a.more) : { images: [] };
      articles[index].content = commonUtil.delHtmlTag(a.content);
      articles[index].created_at = commonUtil.formatDate(Date.parse(a.created_at));
      delete articles[index].article_id;
      delete articles[index].category_id;
    });

    let data = articles;
    return data;
  }


  async getArticlesCounterByTagId(id, isShow = 2) {
    let sql = '';
    var replacements = { id: id};

    sql = `SELECT count(att.article_id) AS count, a.is_show
            FROM tb_article_to_tag AS att 
            LEFT OUTER JOIN tb_article AS a ON att.article_id=a.id
            WHERE att.tag_id=:id`;

    if (isShow == 1) {
      sql += ` AND a.is_show = 1 `;
    } else if (isShow == 0) {
      sql += ` AND a.is_show = 0 `;
    }

    var [results, fields] = await dbUtil.execute(sql, replacements);
    var counter = results[0].count;
    return counter;
  }

}


module.exports = ArticlesService;

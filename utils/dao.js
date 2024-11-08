/**
 * version: 1.2.1
 */

const dbUtil = require('./db.js');

class Dao {
  constructor(tableName='', connection = null){
    this.conn = connection ? connection : dbUtil.getPool();
    this.tableName = tableName;
  }
  
  setTable(tableName){
    this.tableName = tableName;
    return this;
  }

  setConn(conn){
    this.conn = conn;
    return this;
  }
  
  /**
   * 获取一条记录
   * @param {Object} id 表主键id
   */
  async findOne(id){
    if(!this.tableName) throw new Error('table name is required');
    if(!id) throw new Error('id is required');
    
    try{
      let sql = 'SELECT * FROM ' + this.tableName + ' WHERE id=?';
      const [rows] = await this.conn.execute(sql, [id]);
      return rows[0] ? rows[0] : undefined;
    }catch(e){
      throw e;
    }
  }


  /**
   * 根据多个属性值, 查找数据
   * @param {Object} obj 查询对象
   */
  async findAll(obj) {
    if(!this.tableName) throw new Error('table name is required');
    
    let sql = "select * from " + this.tableName;
    let replacements = [];
    
    if(obj.where && Object.keys(obj.where).length){
      let keys = Object.keys(obj.where)
      replacements = keys.map(k => obj.where[k]);
      
      let wheres = ""
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        var isLast = i == keys.length - 1
        if (!isLast){
          wheres += key + " = ? AND "
        } else {
          wheres += key + " = ?"
        }
      }
      sql = sql + " where " + wheres;
    }
    
    if(obj.order){
      let arr = [];
      for (const key in obj.order) {
        arr.push(key + ' ' + obj.order[key]);
      }
      sql += ' ORDER BY ' + arr.toString();
    }
    
    if(obj.limit){
      sql += ' LIMIT ' + obj.limit;
      sql += obj.offset ? (' OFFSET ' + obj.offset) : '';
    }

    try{
      // console.log('sql ', sql, replacements)
      let [rows] = await this.conn.execute(sql, replacements);
      // console.log(rows)
      return rows;
    }catch(e){
      //TODO handle the exception
      throw e;
    } 
    
  }

  
  /**
   * 根据多个属性值, 获取数据总数
   * @param {Object} obj 查询对象
   */
  async findAllCounter(obj) {
    if(!this.tableName) throw new Error('table name is required');
    
    let sql = "select count(*) AS counter from " + this.tableName;
    let replacements = [];

    if(obj.where){
      let keys = Object.keys(obj.where)
      replacements = keys.map(k => obj.where[k]);
      
      let wheres = ""
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        var isLast = i == keys.length - 1
        if (!isLast){
          wheres += key + " = ? AND "
        } else {
          wheres += key + " = ?"
        }
      }
      sql = sql + " where " + wheres;
    }

    let [rows] = await this.conn.execute(sql, replacements);
    return rows.length ? rows[0].counter : 0;
  }
  
  
  /** 
   * 保存一个对象到表中
   * @param {Object} obj 需要保存的对象
   */
  async save(obj){
    if(!this.tableName) throw new Error('table name is required');
    
    // 复制对象
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = obj[key];
      }
    }
    
    // 删除数据库表中不存在的字段
    let [rows] = await this.conn.execute('DESCRIBE ' + this.tableName);
    let fieldsArr = rows.map( i => i.Field );
    for (let key in copy) {
      if(fieldsArr.indexOf(key) == -1){
        delete copy[key];
      }
    }
    
    var keys = Object.keys(copy);
    var replacements = Object.values(copy);
    var params = keys.map(k => '?').toString();
    var sql = "INSERT INTO " + this.tableName + '(' + keys.join(",") + ')' 
              + ' VALUES ' + '(' + params + ')';
    let [result] = await this.conn.execute(sql, replacements);
    return result;
  }
  

  /**
   * 更新一个对象到表中
   * @param {Object} obj 需要保存的对象
   *
   * ResultSetHeader {
   *    fieldCount: 0,
   *    affectedRows: 1,
   *    insertId: 0,
   *    info: '(Rows matched: 1  Changed: 0  Warnings: 0',
   *    serverStatus: 2,
   *    warningStatus: 0,
   *    changedRows: 0
   *  }
   */
  async update(obj){
    if(!this.tableName) throw new Error('table name is required');
    if(!obj.id) throw new Error('id attribute is required');
    
    // 复制对象
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = obj[key];
      }
    }
    // 删除数据库表中不存在的字段
    let [rows] = await this.conn.execute('DESCRIBE ' + this.tableName);
    let fieldsArr = rows.map( i => i.Field );
    for (let key in copy) {
      if(fieldsArr.indexOf(key) == -1){
        delete copy[key];
      }
    }

    let id = copy.id;
    delete copy.id;
    let keys = Object.keys(copy);
    keys = keys.map(k => k + '=:' + k);
    copy.id = id;
    
    let sql = "UPDATE " + this.tableName + ' SET ' + keys.join(",") + ' WHERE id=:id';
    let [result] = await this.conn.execute(sql, copy);
    return result;
  }

  
  /**
   * 删除一条记录
   * @param {Object} obj {id:id, is_show:1}
   */
  async delete(obj){
    if(!this.tableName) throw new Error('table name is required');
    if(typeof obj !== 'object') throw new Error('arguments must be an object');

    let sql = 'DELETE FROM ' + this.tableName;
    let replacements = [];

    if(obj.where && Object.keys(obj.where).length){
      let keys = Object.keys(obj.where)
      replacements = keys.map(k => obj.where[k]);
      
      let wheres = ""
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        var isLast = i == keys.length - 1
        if (!isLast){
          wheres += key + " = ? AND "
        } else {
          wheres += key + " = ?"
        }
      }
      sql = sql + " WHERE " + wheres;
    } else {
      throw new Error('where condition is required');
    }

    let [result] = await this.conn.execute(sql, replacements);
    return result;
  }


}

module.exports = Dao;

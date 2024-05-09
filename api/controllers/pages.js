const i18n = require('i18n');
const Validator = require('fov');

const dbUtil = require("../utils/db.js");
const commonUtil = require("../utils/common.js");
const Dao = require("../utils/dao.js");


async function store(req, res) {
  const validator = new Validator();
  const rules = {
    title:{type:'string', min:1, max:100},
    description:{type:'string', max:255, required:false},
  };
  const errors = validator.validate(req.body, rules);
  if (errors && errors.length) {
    res.status(400).send({ error: errors[0].message });
    return;
  }

  req.body.user_id = req.userId;
  req.body.created_at = commonUtil.formatDateTime();

  try {
    const pageDao = new Dao();
    pageDao.setTable('tb_page');
    const result = await pageDao.save(req.body);
    const page = await pageDao.findOne(result.insertId);

    res.status(201).json(page);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}


async function update(req, res) {
  const validator = new Validator();
  const rules = {
    title:{type:'string', min:1, max:100},
    description:{type:'string', max:255, required:false},
  };
  const errors = validator.validate(req.body, rules);
  if (errors && errors.length) {
    res.status(400).send({ error: errors[0].message });
    return;
  }

  req.body.id = req.params.id;
  req.body.user_id = req.userId;
  req.body.created_at = commonUtil.formatDateTime();
  
  try {
    const pageDao = new Dao('tb_page');
    const result = await pageDao.update(req.body);
    const page = await pageDao.findOne(req.body.id);
    if(!page){
      res.status(404).json({error:i18n.__('404')});
      return;
    }

    res.json(page);
  } catch(error) {
    console.log(error);
    res.status(500).json({error: error.message});
  }
}


async function destroy(req, res) {
  try {
    let id = req.params.id;
    const pageDao = new Dao('tb_page');
    const condation = { where:{id:id}};
    const result = await pageDao.delete(condation);
    res.status(204).send('');
  } catch(e) {
    res.status(500);
    res.json({'error': e.message});
    return;
  }
}


module.exports = {
  store,
  update,
  destroy
};

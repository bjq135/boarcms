async function index(req, res)  {
  let data = {};  
  res.render('admin/site/index.html', data);
}

async function update(req, res)  {
  console.log(req.body);
  res.send(req.body);
}

module.exports = { index, update };
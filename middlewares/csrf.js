
async function csrf( req, res, next){
  if(!req.cookies._csrf){
    res.cookie('_csrf', Math.round(Math.random()*999999) );
  }
  
  if(req.method == 'GET'){
    next();
    return;
  }

  if(req.query._csrf !== req.cookies._csrf){
    res.status(400);
    res.send({error:'miss _csrf token'});
    return;
  }

  next();
}

module.exports = { csrf };
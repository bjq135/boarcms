/**
 * CSRF 双重 Cookie 验证
 */

async function csrf( req, res, next){
  // 如果请求不含有 cookie，设定该请求来源于 app，跳过验证
  if(Object.keys(req.cookies).length == 0){
    next();
    return;
  }

  // 双重 Cookie 验证
  if(!req.cookies._csrf){
    res.cookie('_csrf', Math.round(Math.random()*999999) );
  }
  
  if(req.method == 'GET'){
    next();
    return;
  }

  if(req.query._csrf == undefined || req.query._csrf !== req.cookies._csrf){
    res.status(400);
    res.send({error:'miss _csrf token'});
    return;
  }

  next();
}

module.exports = { csrf };
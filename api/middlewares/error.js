const logger = require('../utils/logger.js');

module.exports = async function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send({error: "error middleware: " + err.message});
};

'use strict';

//middle wares
function logger(req, res, next) {
  // console.log(req);
  console.info(new Date(), req.method, req.url);
  next();
}

module.exports = {
  logger
};
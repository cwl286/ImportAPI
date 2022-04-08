const morgan = require('morgan');
const fs = require('fs');
const accessDir = require('../../config/index').config.logger.accessDir || './access.log';

/**
 * log errors on console, and log all access in access.log
 * @param {object} app
 */
const init = (app) => {
  // log only 4xx and 5xx responses to console
  app.use(morgan('common', {
    skip: function (req, res) {return res.statusCode < 400;}
  }));
   
  // log all requests to access.log
  app.use(morgan('common', {
    stream: fs.createWriteStream(accessDir, {flags: 'a'})
  }));
};

module.exports = init;

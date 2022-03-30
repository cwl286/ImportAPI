const morgan = require('morgan');
const {config} = require('../config');
const fs = require('fs');
const path = require('path');

/**
 * Initialize "morgan" depending on process.env.LOG_DIR is defined or not
 * @param {object} app
 */
const initMorgan = (app) => {
  if (config.logDir) {
    // create a write stream (in append mode)
    const accessLogStream = fs.createWriteStream(path.join(__dirname, config.logDir), {flags: 'a'});
    // setup the logger
    app.use(morgan('combined', {stream: accessLogStream}));
  } else {
    // log all request in the Apache combined format to STDOUT
    app.use(morgan('combined'));
  }
};

module.exports = initMorgan;

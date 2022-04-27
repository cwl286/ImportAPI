module.exports = {
  initAuth: require('./authorization/index').init,
  initAccessLogger: require('./logger/index').initAccessLogger,
  logger: require('./logger/index').logger,
  errorHandler: require('./error/index').errorHandler,
  customErrors: require('./error/index').customErrors,
};


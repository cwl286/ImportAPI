module.exports = {
  Feedback: require('./feedback'),
  initAuth: require('./authorization/index').init,
  apiRouterV1: require('./routes/index').apiRouterV1,
  apiRouterV2: require('./routes/index').apiRouterV2,
  initAccessLogger: require('./logger/index').initAccessLogger,
  logger: require('./logger/index').logger,
  errorHandler: require('./error/index').errorHandler,
  customErrors: require('./error/index').customErrors,
};


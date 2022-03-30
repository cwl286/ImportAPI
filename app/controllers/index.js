module.exports = {
  initAuth: require('./authorization/index').init,
  importHtml: require('./fetch/index').importHtml,
  apiRouter: require('./routes/v1/index').apiRouter,
  feedback: require('./routes/v1/index').feedback,
};


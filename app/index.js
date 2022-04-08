const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');

const { apiRouterV1, apiRouterV2, initAuth, initAccessLogger, Feedback,
  errorHandler, customErrors } = require('./controllers/index');
const { config } = require('./config/index');
const app = express();

// security middlewares
app.use(helmet());

// init session
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
if (config.session.store === 'REDIS' || config.session.store === 'redis') {
  // Configure redis client if process.env.REDIS_URL exists
  const session = require('express-session');
  const { createClient } = require('redis');
  const RedisStore = require('connect-redis')(session);
  const redisClient = createClient(
    {
      // Currently connect-redis is not compatible with the latest version of node redis.
      legacyMode: true,
      url: config.session.storeUrl,
    },
  );
  redisClient.connect()
    .then(() => {console.log(`Successfully connected REDIS ${config.session.storeUrl}`);})
    .catch((error) => {
      console.error(error);
      throw new customErrors.APIError(
        name = 'Redis Error',
        description = `Fail to connect Redis ${config.session.storeUrl}`);
    });
  config.session.options.store = new RedisStore({ client: redisClient });
}
app.use(session(config.session.options));

// init authorization
initAuth(app);

// init logger
initAccessLogger(app);

// Routing
app.all('/', function (req, res) {
  res.status(200).json(new Feedback(true, 'This is the main page'));
});

app.use('/api/v1', apiRouterV1);
app.use('/api/v2', apiRouterV2);

// '/logout'
app.all('/logout', function (req, res) {
  req.session.destroy();// kill session in store
  req.logout();
  res.redirect('/');
});

// '/unauth'
app.all('/unauth', (req, res, next) => {
  throw new customErrors.UnauthError();
});

// '/*' wildcard routing 
app.all('/*', function (req, res) {
  throw new customErrors.NotFoundError();
});

// app error-handling 
app.use((err, req, res, next) => {
  if (errorHandler.isTrustedError(err)) {
    res.status(err.httpCode).json(new Feedback(false, err.message));
  } else {
    // handle distrusted error
    errorHandler.handleError(err);
    res.status(500).json(new Feedback(false, 'Something broke!'));
  }
});

module.exports = app;

require('dotenv').config(); // Get setting from ./.env

/**
 *  Can set all configs related to envirnments here
 */
const config = {};

// 'production', 'development', 'debug', 'trace' for settings in logger.js
config.env = process.env.NODE_ENV || 'development';

config.logger = {
  accessDir: './logs/access.log',
  traceDir: './logs/trace.log', // 'trace'
  debugDir: './logs/debug.log', // 'debug'
  infoDir: './logs/info.log', // 'development'
  errorDir: './logs/error.log', // 'production'
};

config.server = {
  port: process.env.PORT || 3000,
};

config.puppeteer = {
  proxyUrl: process.env.PROXY_SERVER,
  // install chromium for docker; executablePath: '/usr/bin/chromium-browser', 
  browser: process.env.CHROME_BIN,
};

config.session = {
  options: {
    secret: process.env.SESSION_SECRET || 'default_local_secret!',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      secure: false, // true = HTTPS
      maxAge: 300000, // milliseconds
    },
  },
  store: process.env.SESSION_STORE, // if set to 'REDIS', session will be stored in REDIS
  storeUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379', // default redis url
};

module.exports = config;

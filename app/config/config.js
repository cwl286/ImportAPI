require('dotenv').config(); // Get setting from ./.env

/**
 *  Can set all configs related to envirnments here
 */
const config = {};

// 'production' or 'development'
config.env = process.env.NODE_ENV || 'development';

config.logger = {
  accessDir: process.env.ACCESS_LOG_DIR || './logs/access.log',
  infoDir: process.env.ACCESS_LOG_DIR || './logs/info.log',
  errorDir: process.env.ACCESS_LOG_DIR || './logs/error.log',
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
}

module.exports = config;

require('dotenv').config(); // Get setting from .env

const config = {};

config.logDir = process.env.LOG_DIR;

config.server = {
  port: process.env.PORT || 3000,
};

config.sessionOption = {
  secret: process.env.SESSION_SECRET || 'default_local_secret!',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    secure: false, // true = HTTPS
    maxAge: 300000, // milliseconds
  },
};

// Configure redis client if process.env.SESSION_STORE = REDIS
if (process.env.SESSION_STORE === 'REDIS') {
  console.log(process.env);
  const session = require('express-session');
  const {createClient} = require('redis');
  const RedisStore = require('connect-redis')(session);
  const redisClient = createClient({
    url: process.env.REDIS_STORE_URL || 'redis://127.0.0.1:6379',
    legacyMode: true,
  });// Currently connect-redis is not compatible with the latest version of node redis.
  redisClient.connect().then(() => console.log('success')).catch(console.error);
  config.sessionOption.store = new RedisStore({client: redisClient});
}

module.exports = config;

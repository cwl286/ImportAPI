const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet =  require('helmet');
const { apiRouter, initAuth, feedback } = require('./controllers/index');
const sessionOption = require('./config/index').config.sessionOption;
const {initMorgan} = require('./logger/index');
const { status } = require('express/lib/response');
const app = express();

// security middlewares
app.use(helmet());

// init authorization
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionOption));
initAuth(app);

// init logger
initMorgan(app);

// Routing

app.all('/', function (req, res) {
  res.status(200).json(feedback.mainPage);
});

app.use('/api/v1', apiRouter);


app.all('/logout', function (req, res) {
  req.session.destroy();// kill session in store
  req.logout();
  res.redirect('/');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(new feedback.Message(isSuccess = false, result = err)).end();
});

module.exports = app;

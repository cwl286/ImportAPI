const app = require('./app/index');
const port = require('./app/config/index').config.server.port;

app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log(`server is listening on ${port}...`);
});

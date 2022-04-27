const app = require('./app/index');
const port = require('./app/config/index').config.server.port;
const { errorHandler } = require('./app/controllers/error/index');

const server = app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log(`server is listening on ${port}...`);
});

// Error-handling
process.on('uncaughtException', (err) => {
  errorHandler.handleError(err);
  // shut down if fail to solve
  if (!errorHandler.isTrustedError(err)) {
    server.close(() => {
      console.log(`server is shutting down. `);
      process.exit(1);
    });
    // shut down the process completely if not done after 1 seconds
    setTimeout(() => {
      console.log(`Force the server to shut donw!`);
      process.abort();
    }, 1000).unref();
  }
});

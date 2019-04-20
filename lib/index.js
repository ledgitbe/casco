const sync = require('./sync/');
const umr = require('umr');

// For now we're keeping the sync function and umr separate

function createApp() {
  let app = umr();
  app.listen = sync.bind(app);
  return app;
}

module.exports = exports = createApp;

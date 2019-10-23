const sync = require('./sync/');
const adapter = require('./sync/adapters/bitdb.js');
const umr = require('umr');
const Router = require('casco-koa-router');

// For now we're keeping the sync function and umr separate

function createApp() {
  let app = new Router();

  /**
   * Start syncing and listening to transactions
   * @param {String|Object}
   * @param {Number|Object}
   * @param {null|Number}
   */
  function listen() {
    let socketQuery, dbQuery;

    if (arguments.length === 2) {
      let [uri, height] = arguments;

      if (typeof uri === 'string') {
        let [type,address] = uri.split('://');
        if (Object.keys(adapter.queries.socket).indexOf(type) >= 0) {
          socketQuery = adapter.queries.socket[type](address);
          dbQuery = adapter.queries.db[type](address, height);
        } else {
          throw new Error('Unsupported uri in listen(), use bitcom, paymentTo or paymentFrom');
        }
      }
    } else if (arguments.length === 3) {
      socketQuery = arguments[0];
      dbQuery = arguments[1];
      height = arguments[2];

      if (typeof socketQuery !== 'object' || typeof dbQuery !== 'object' || typeof height !== 'number') {
        throw new Error('socketQuery must be object, dbQuery must be object, height must be number');
      }
    } else {
      throw new Error('Invalid number of arguments: listen(uri, height) or listen(socketQuery, dbQuery, height)');
    }

    return sync(app, socketQuery, dbQuery);
  }

  app.listen = listen;
  return app;
}

module.exports = exports = createApp;

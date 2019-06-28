/*
 * Copyright (C) 2019 Ledgit bvba
 *
 * This file is part of Ledgit
 *
 * Ledgit is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Debit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with debit.  If not, see <http://www.gnu.org/licenses/>.
 */

const sync = require('./sync/');
const adapter = require('./sync/adapters/bitdb.js');
const umr = require('umr');

// For now we're keeping the sync function and umr separate

function createApp() {
  let app = umr();

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

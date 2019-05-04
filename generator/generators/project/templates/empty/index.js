const ledgit = require('ledgit');
const router = require('ledgit/lib/middleware/router-s2json');
const logger = require('ledgit/lib/middleware/logger');
const validator = require('ledgit/lib/middleware/validator');

require('dotenv').config();

const app = ledgit();

app.use(router);
app.use(logger);

/* This is an example handler 
 * 
 * Fund your client and then run the client like this:
 * `node client.js set hello world
 *
 * app.use('set', validator({ key: "string", value: "any"}), (req, res) => {
 *   console.log(`${req.caller} is setting ${key} to ${value}`);
 * });
 *
 */

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

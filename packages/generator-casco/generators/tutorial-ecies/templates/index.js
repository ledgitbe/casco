const ledgit = require('ledgit');
const decrypt = require('../lib/middleware/decrypt-s2json.js');

require('dotenv').config();

const app = ledgit();

/*
 * Define your application handlers here
 *
 * For example:
 *
 * app.use((req, res) => {
 *  console.log("New tx!");
 *  console.log(req.tx);
 *  })
 *
 * Check out the other examples and the documentation.
 *
 */

// use standard decryption middleware to decrypt transaction payload
app.use(decrypt(process.env.PRIVATE_KEY));

app.use((req, res) => {
  console.log('The handler was called by ' + req.caller);
  console.log('The decrypted route was ' + req.route);
  console.log('The decrypted arguments provided were ' + JSON.stringify(req.args));
});


app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

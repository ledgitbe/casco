const Casco = require('casco');
const router = require('casco/lib/middleware/router-s2json');
const validator = require('casco/lib/middleware/validator');

require('dotenv').config();

const app = Casco();

app.use(router);

/* Argument validation
 * 
 * The standard validator middleware ensures that the arguments
 * provided in a transaction match the expected type.
 *
 * Furthermore, the validator populates `req.params` with named
 * arguments
 *
 *
 * Here, the set function requires 2 arguments called key and value
 * If for example a transaction comes in where the key is a number,
 * then then handler will not run.
 *
 * If the transaction arguments are validated, the handler can access
 * the arguments in `req.params`
 */

var state = {};

app.use('set', validator({ key: "string", value: "any" }), (req, res) => {
  let [key, value] = req.args;
  state[key] = value;
});

app.use('del', validator({ key: "string" }), (req, res) => {
  let [key] = req.args;
  delete state[key];
});

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

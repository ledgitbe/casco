const Casco = require('casco');

require('dotenv').config();

const app = Casco();

// middleware router function
// the only thing a router needs to do is set req.route and call next()
// if req.route is set, you can use named app handlers as shown below
function router(req, res, next) {
  // Lets assume a protocol like this:
  // OP_RETURN <BITCOM_ID> <JSON ENCODED ARRAY WITH FUNC AND ARGS>
  // 
  // Now we can route like this

  // Don't set route or args if req.route is already set previously
  if (!req.route) {
    let payload = JSON.parse(req.tx.out[0].s2);

    req.route = payload[0];
    req.args = payload.slice(1);
  }

  // req.caller is filled with the transaction sender
  req.caller = req.tx.in[0].e.a;

  next();
}

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

// use newly created router
app.use(router);

// now we can use named handlers
app.use('users', (req, res) => {
  console.log('The users handler was called by ' + req.caller);
  console.log('The arguments provided were ' + JSON.stringify(req.args));
});
app.use('messages', (req, res) => {
  console.log('The messages handler was called by ' + req.caller);
  console.log('The arguments provided were ' + JSON.stringify(req.args));
});


app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

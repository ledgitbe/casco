const ledgit = require('ledgit');
const router = require('ledgit/lib/middleware/router-s2json');

require('dotenv').config();

const app = ledgit();

/*
 * Middleware functions 
 *
 * Middleware functions are useful to add extra functionality
 * to some or all of your handlers.
 *
 * Let's write a simple logger middleware.
 * We will register the logger middleware before any handlers
 * so when a TX comes in, it will flow like this:
 *
 * <Bitcoin TX> -> logger -> handler
 *
 * Middleware functions have the following signature:
 * function(req, res, next) {}
 */

function logger(req, res, next) {
  console.log("Incoming transaction! Tx Hash: " + req.tx.h);
  next();
}

function handler(req, res) {
  console.log("Processing request.");
  // Do something here
}

// Register the handlers in the right order
app.use(logger);
app.use(handler);

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

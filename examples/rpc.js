const brisk = require('..');
const router = require('../lib/middleware/router-s2json');
const logger = require('../lib/middleware/logger');
const responder = require('../lib/middleware/responder');
const validator = require('../lib/middleware/validator');

require('dotenv').config();

const state = {
  db: {},
  participants: [],
  initialized: false,
};

function mustBeParticipant(req, res, next) {
  if (state.participants.indexOf(req.caller) >= 0) {
    next();
  } else {
    console.log("Received call for " + req.fn + " but caller is not participant");
  }
}

function mustHaveArguments(howmany) {
  return function(req, res, next) {
    if (req.args.length === howmany) {
      next();
    } else {
      console.log(`Received call for '${req.fn}' with incorrect number of args. Expected ${howmany}, but only ${req.args.length} given`);
    }
  }
}

function requiresInit(req, res, next) {
  if (state.initialized) {
    next();
  }
}

const app = brisk();

// rpcRouter implements the following protocol:
// txOutput 0: OP_RETURN <BITCOM_ID> <ROUTE> <JSON ENCODED ARGUMENTS ARRAY>
// Fills req.route, req.args, req.caller
//app.use(decrypt(process.env.PRIVATE_KEY));
app.use(router);

// Log rpc transactions every time
app.use(logger);
app.use((req, res, next) => {
  next();
  console.log(state);
});

app.use('init', (req, res) => {
  if (!state.initialized) {
    state.participants = state.participants.concat(req.caller);
    state.initialized = true;
  }
});

app.use('invite', requiresInit, mustBeParticipant, (req, res) => {
  state.participants = state.participants.concat(req.args[0]);
});

/*
 * This function uses the validator middleware 
 * to make named arguments available under req.params
 */
app.use('set', requiresInit, mustBeParticipant, validator({ key: "string", value: "any"}), (req, res) => {
  let { key, value } = req.params;
  state.db[key] = value;
});

/*
 * This function doesn't use the validator middleware.
 * It just uses req.args and takes the first element of it
 */
app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let key = req.args[0];
  delete state.db[key];
});

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
  }
});

app.listen(`bit://${process.env.ADDRESS}`, 570000);

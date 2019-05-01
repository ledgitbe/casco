const ledgit = require('ledgit');
const router = require('ledgit/lib/middleware/router-s2json');
const logger = require('ledgit/lib/middleware/logger');
const responder = require('ledgit/lib/middleware/responder');

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

const app = ledgit();

// router-s2json implements the following protocol:
// txOutput 0: OP_RETURN <BITCOM_ID> <JSON ENCODED ARRAY I.E. [func, arg1, arg2, ...]>
// Fills req.route, req.args, req.caller
app.use(router);

// Log route, args and caller every time
app.use(logger);
app.use((req, res, next) => { next(); console.log(state); });

// Attach req.send if we're not syncing
app.use(responder(process.env.PRIVATE_KEY, (err, txid) => {console.log(err, txid)}));


app.use('init', (req, res) => {
  if (!state.initialized) {
    state.participants = state.participants.concat(req.caller);
    state.initialized = true;
  }
});

app.use('invite', requiresInit, mustBeParticipant, (req, res) => {
  state.participants = state.participants.concat(req.args[0]);
});

app.use('set', requiresInit, mustBeParticipant, mustHaveArguments(2), (req, res) => {
  let [key, value] = req.args;
  state.db[key] = value;
  res.send([process.env.ADDRESS, 'confirm', JSON.stringify([req.tx.tx.h])]);
});

app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let [key] = req.args;
  delete state.db[key];
});

app.use('confirm', (req, res) => {
  if (req.caller === process.env.ADDRESS) {
    console.log('We confirmed transaction ' + req.args[0]);
  }
});

app.listen(`bit://${process.env.ADDRESS}`, 570000);

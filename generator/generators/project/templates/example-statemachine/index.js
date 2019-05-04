const ledgit = require('ledgit');
const router = require('ledgit/lib/middleware/router-s2json');
const logger = require('ledgit/lib/middleware/logger');
const validator = require('ledgit/lib/middleware/validator');

require('dotenv').config();

/*
 * This example implements a simple permissioned state machine
 * 
 * The first person to call 'init' becomes a participant
 *
 * A participant can invite other participants with the 'invite'
 * command
 *
 *
 * Participants can use 'set' and 'del' to change the 
 * in-memory application state;
 *
 */

function mustBeParticipant(req, res, next) {
  if (state.participants.indexOf(req.caller) >= 0) {
    next();
  } else {
    console.log("Received call for " + req.fn + " but caller is not participant");
  }
}

function requiresInit(req, res, next) {
  if (state.initialized) {
    next();
  }
}

// This will store our state
const state = {
  initialized: false,
  participants: [],
  db: {},
};

const app = ledgit();

app.use(router);
app.use(logger);

app.use('init', (req, res) => {
  // You must call `init` with a funded client to become the first participant
  if (!state.initialized) {
    state.participants = state.participants.concat(req.caller);
    state.initialized = true;
  }
});

app.use('invite', requiresInit, mustBeParticipant, validator({ invitee: "string" }), (req, res) => {
  if (state.participants.indexOf(req.params.invitee) < 0) {
    state.participants = state.participants.concat(req.params.invitee);
  }
});

app.use('set', requiresInit, mustBeParticipant, validator({ key: "string", value: "any" }), (req, res) => {
  let { key, value } = req.params;
  state.db[key] = value;
});

app.use('del', requiresInit, mustBeParticipant, validator({ key: "string" }), (req, res) => {
  client.del(req.params.key);;
  delete state.db[key];
});

app.listen(`bit://${process.env.ADDRESS}`, <%= height %>);

const brisk = require('brisk');
const simpleRpcRouter = require('brisk/lib/middleware/simple-rpc-router');

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

function logger(req, res, next) {
  console.log(`CALL ${req.route} ${req.args}`);
  next();
  console.log(state);
}

const app = brisk();

app.address = "14yDSfMug1RxTRfAKC1mrfD1LqoBGSXUWc";
app.from = 571999;

app.use(simpleRpcRouter);
app.use(logger);

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
});

app.use('del', requiresInit, mustBeParticipant, mustHaveArguments(1), (req, res) => {
  let [key] = req.args;
  delete state.db[key];
});

app.listen();

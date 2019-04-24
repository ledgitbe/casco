function logger(req, res, next) {
  if (req.route && req.args && req.caller) {
    console.log(`RPC Call '${req.route}' with args '${req.args}' from '${req.caller}'`);
  } else {
    console.log("You are using the rpc-logger middleware but it seems like you have not loaded the rpc middleware");
  };

  next();
}

module.exports = exports = logger;

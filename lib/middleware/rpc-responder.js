const datapay = require('datapay');

function createResponder(privateKey, cb) {
  return function(req, res, next) {
    if (!req.isSyncing) {
      console.log("RESPONDER IS SETTING RES.SEND");
      res.send = function(data) {
        console.log("sending response" + data);
        datapay.send({ data: data, pay: { key: privateKey } }, cb);
      };
    }
    next();
  }
}

module.exports = exports = createResponder;

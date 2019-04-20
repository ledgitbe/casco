function router(req, res, next) {
  // Lets assume a protocol like this:
  // OP_RETURN <BITCOM_ID> <FUNCTION> <JSON ENCODED ARGS ARRAY>
  // 
  // Now we can route like this

  // req.route determines where we route
  req.route = req.tx.out[0].s2;

  // arguments are in out[0].s3
  req.args = JSON.parse(req.tx.out[0].s3);

  // req.caller is filled with the transaction sender
  req.caller = req.tx.in[0].e.a;

  next();
}

module.exports = exports = router;

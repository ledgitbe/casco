function router(req, res, next) {
  // Lets assume a protocol like this:
  // OP_RETURN <BITCOM_ID> <JSON ENCODED ARRAY WITH FUNC AND ARGS>
  // 
  // Now we can route like this

  // Don't set route or args if req.route is already set previously
  if (!req.route) {
    let payload = JSON.parse(req.tx.out[0].s3);

    req.route = payload[0];
    req.args = payload.slice(1);
  }

  // req.caller is filled with the transaction sender
  req.caller = req.tx.in[0].e.a;

  next();
}

module.exports = exports = router;

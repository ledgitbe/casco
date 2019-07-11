function router(req, res, next) {
  // Lets assume a protocol like this:
  // OP_RETURN <BITCOM_ID> <FUNC> <ARG1> <ARG2> <ARG3> ...

  // Don't set route or args if req.route is already set previously
  if (!req.route) {

    req.route = req.tx.out[0].s1;
    req.args = [];

    let index = 2;
    while (req.tx.out[0]['s' + index]) {
      req.args.push(req.tx.out[0]['s' + index]);
      index += 1;
    }
  }

  // req.caller is filled with the transaction sender
  req.caller = req.tx.in[0].e.a;

  next();
}

module.exports = exports = router;

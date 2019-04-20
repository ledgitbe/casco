function router(req, res, next) {
  // Lets assume a protocol like this:
  // OP_RETURN <BITCOM_ID> <FUNCTION> <JSON ENCODED ARGS ARRAY>
  // 
  // Now we can route like this

  req.route = req.tx.out[0].s2;
  req.args = JSON.parse(req.tx.out[0].s3);

  next();
}

module.exports = exports = router;

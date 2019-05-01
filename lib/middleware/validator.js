const Validator = require("fastest-validator");

/*
 * This validator can be used to validate arguments
 * 
 * When req.args is an array (usually) created from
 * OP_RETURN arguments, the validator will automatically
 * convert the array to named parameters and store them in
 * req.params
 *
 * Example:
 * req.args = [1, "hello"];
 *
 * To convert this into named parameters AND validate it,
 * use the following pattern
 *
 * { id: 'number', greeting: "string" }
 *
 * The resulting of this validator is
 *
 * req.params = { id: 1, greeting: "hello" }
 * 
 */

function argsToParams(pattern, args) {
  let wantedKeys = Object.keys(pattern);
  let params = {};

  for (let i=0; i<args.length; i++) {
    params[wantedKeys[i]] = args[i];
  }

  return params;
}


/* 
 * { arg1: "string", args2: "string" }
 */
function createValidator(pattern) {
  //  console.log("Validator middleware loaded");
  let v = new Validator();
  let isValidPattern= v.compile(pattern);

  return function(req, res, next) {
    let params;

    // Do array to object trick when req.args is array
    if (typeof req.args === 'object' && Array.isArray(req.args)) {
      params = argsToParams(pattern, req.args);
    } else if (typeof req.args === 'object') {
      params = req.args;
    } else {
      throw new TypeError("req.args should be an Object or Array");
    }

    let isValidParams = isValidPattern(params);

    if (isValidParams === true) {
      req.params = params;
      next();
    } else {
      next(new Error("Parameter validation failed"));
    }
  }
}


module.exports = exports = createValidator;

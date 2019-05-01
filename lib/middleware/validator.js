const Validator = require("fastest-validator");


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
  console.log("Validator middleware loaded");
  let v = new Validator();
  let isValidPattern= v.compile(pattern);

  return function(req, res, next) {
    let params = argsToParams(pattern, req.args);
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

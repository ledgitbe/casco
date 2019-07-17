/*!
 * Universal Middleware Router (umr)
 * 
 * This software is forked from 'connect'
 *
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2019 Ledgit
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('umr');
var EventEmitter = require('events').EventEmitter;
var merge = require('utils-merge');
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

/**
 * Module exports.
 * @public
 */

module.exports = createApp;

/**
 * Module variables.
 * @private
 */

var env = process.env.NODE_ENV || 'development';
var proto = {};

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

/**
 * Create a new app.
 *
 * @return {function}
 * @public
 */

function createApp() {
  function app(req, res, next){ app.handle(req, res, next); }
  merge(app, proto);
  merge(app, EventEmitter.prototype);
  app.route = '*';
  app.stack = [];
  return app;
}

/**
 * @param {String} route
 * @param {Function} callback
 * @return {Server} for chaining
 * @public
 */

proto.use = function use() {
  var path = slice.call(arguments)[0];
  var handles = slice.call(arguments, 1);

  if (typeof path !== 'string') {
    path = '*';
    handles = arguments;
  }

  for (var i = 0; i < handles.length; i++) {
    var handle = handles[i];

    if (typeof handle !== 'function') {
      var type = toString.call(handle);
      throw new Error("App.use() requires a callback function but got a " + type)
    }

    // add the middleware
    debug('use %s %s', path || '/', handle.name || 'anonymous');
    this.stack.push({ route: path, handle: handle });
  }


  return this;
};

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @private
 */

proto.handle = function handle(req, res, out) {
  var index = 0;
  var stack = this.stack;

  // final function handler
  var done = out;

  function next(err) {
    // next callback
    var layer = stack[index++];

    // all done
    if (!layer) {
      defer(done, err);
      return;
    }

    // route data
    var path = req.route;
    var route = layer.route;

    // skip this layer if the route doesn't match
    if (path !== route && route !== '*') {
      return next(err);
    }

    // call the layer handle
    call(layer.handle, route, err, req, res, next);
  }

  next();
};

/**
 * Invoke a route handle.
 * @private
 */

function call(handle, route, err, req, res, next) {
  var arity = handle.length;
  var error = err;
  var hasError = Boolean(err);

  debug('%s %s : %s', handle.name || '<anonymous>', route, req.route);

  try {
    if (hasError && arity === 4) {
      // error-handling middleware
      handle(err, req, res, next);
      return;
    } else if (!hasError && arity < 4) {
      // request-handling middleware
      handle(req, res, next);
      return;
    }
  } catch (e) {
    // replace the error
    error = e;
  }

  // continue
  next(error);
}

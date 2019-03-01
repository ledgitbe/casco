/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.messages = (function() {

    /**
     * Namespace messages.
     * @exports messages
     * @namespace
     */
    var messages = {};

    messages.Request = (function() {

        /**
         * Properties of a Request.
         * @memberof messages
         * @interface IRequest
         * @property {number|null} [version] Request version
         * @property {number|Long|null} [timestamp] Request timestamp
         * @property {string|null} [func] Request func
         * @property {Array.<string>|null} [args] Request args
         */

        /**
         * Constructs a new Request.
         * @memberof messages
         * @classdesc Represents a Request.
         * @implements IRequest
         * @constructor
         * @param {messages.IRequest=} [properties] Properties to set
         */
        function Request(properties) {
            this.args = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Request version.
         * @member {number} version
         * @memberof messages.Request
         * @instance
         */
        Request.prototype.version = 0;

        /**
         * Request timestamp.
         * @member {number|Long} timestamp
         * @memberof messages.Request
         * @instance
         */
        Request.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Request func.
         * @member {string} func
         * @memberof messages.Request
         * @instance
         */
        Request.prototype.func = "";

        /**
         * Request args.
         * @member {Array.<string>} args
         * @memberof messages.Request
         * @instance
         */
        Request.prototype.args = $util.emptyArray;

        /**
         * Creates a new Request instance using the specified properties.
         * @function create
         * @memberof messages.Request
         * @static
         * @param {messages.IRequest=} [properties] Properties to set
         * @returns {messages.Request} Request instance
         */
        Request.create = function create(properties) {
            return new Request(properties);
        };

        /**
         * Encodes the specified Request message. Does not implicitly {@link messages.Request.verify|verify} messages.
         * @function encode
         * @memberof messages.Request
         * @static
         * @param {messages.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.func != null && message.hasOwnProperty("func"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.func);
            if (message.args != null && message.args.length)
                for (var i = 0; i < message.args.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.args[i]);
            return writer;
        };

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link messages.Request.verify|verify} messages.
         * @function encodeDelimited
         * @memberof messages.Request
         * @static
         * @param {messages.IRequest} message Request message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Request.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @function decode
         * @memberof messages.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {messages.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.messages.Request();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.uint32();
                    break;
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.func = reader.string();
                    break;
                case 4:
                    if (!(message.args && message.args.length))
                        message.args = [];
                    message.args.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof messages.Request
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {messages.Request} Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Request.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Request message.
         * @function verify
         * @memberof messages.Request
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Request.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.func != null && message.hasOwnProperty("func"))
                if (!$util.isString(message.func))
                    return "func: string expected";
            if (message.args != null && message.hasOwnProperty("args")) {
                if (!Array.isArray(message.args))
                    return "args: array expected";
                for (var i = 0; i < message.args.length; ++i)
                    if (!$util.isString(message.args[i]))
                        return "args: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof messages.Request
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {messages.Request} Request
         */
        Request.fromObject = function fromObject(object) {
            if (object instanceof $root.messages.Request)
                return object;
            var message = new $root.messages.Request();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.func != null)
                message.func = String(object.func);
            if (object.args) {
                if (!Array.isArray(object.args))
                    throw TypeError(".messages.Request.args: array expected");
                message.args = [];
                for (var i = 0; i < object.args.length; ++i)
                    message.args[i] = String(object.args[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @function toObject
         * @memberof messages.Request
         * @static
         * @param {messages.Request} message Request
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Request.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.args = [];
            if (options.defaults) {
                object.version = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.func = "";
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.func != null && message.hasOwnProperty("func"))
                object.func = message.func;
            if (message.args && message.args.length) {
                object.args = [];
                for (var j = 0; j < message.args.length; ++j)
                    object.args[j] = message.args[j];
            }
            return object;
        };

        /**
         * Converts this Request to JSON.
         * @function toJSON
         * @memberof messages.Request
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Request.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Request;
    })();

    messages.Response = (function() {

        /**
         * Properties of a Response.
         * @memberof messages
         * @interface IResponse
         * @property {number|null} [version] Response version
         * @property {number|Long|null} [timestamp] Response timestamp
         * @property {number|Long|null} [seq] Response seq
         * @property {number|null} [status] Response status
         * @property {string|null} [error] Response error
         * @property {string|null} [message] Response message
         */

        /**
         * Constructs a new Response.
         * @memberof messages
         * @classdesc Represents a Response.
         * @implements IResponse
         * @constructor
         * @param {messages.IResponse=} [properties] Properties to set
         */
        function Response(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Response version.
         * @member {number} version
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.version = 0;

        /**
         * Response timestamp.
         * @member {number|Long} timestamp
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Response seq.
         * @member {number|Long} seq
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.seq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Response status.
         * @member {number} status
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.status = 0;

        /**
         * Response error.
         * @member {string} error
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.error = "";

        /**
         * Response message.
         * @member {string} message
         * @memberof messages.Response
         * @instance
         */
        Response.prototype.message = "";

        /**
         * Creates a new Response instance using the specified properties.
         * @function create
         * @memberof messages.Response
         * @static
         * @param {messages.IResponse=} [properties] Properties to set
         * @returns {messages.Response} Response instance
         */
        Response.create = function create(properties) {
            return new Response(properties);
        };

        /**
         * Encodes the specified Response message. Does not implicitly {@link messages.Response.verify|verify} messages.
         * @function encode
         * @memberof messages.Response
         * @static
         * @param {messages.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.seq != null && message.hasOwnProperty("seq"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.seq);
            if (message.status != null && message.hasOwnProperty("status"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.status);
            if (message.error != null && message.hasOwnProperty("error"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.error);
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified Response message, length delimited. Does not implicitly {@link messages.Response.verify|verify} messages.
         * @function encodeDelimited
         * @memberof messages.Response
         * @static
         * @param {messages.IResponse} message Response message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Response.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Response message from the specified reader or buffer.
         * @function decode
         * @memberof messages.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {messages.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.messages.Response();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.uint32();
                    break;
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.seq = reader.uint64();
                    break;
                case 4:
                    message.status = reader.uint32();
                    break;
                case 5:
                    message.error = reader.string();
                    break;
                case 6:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Response message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof messages.Response
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {messages.Response} Response
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Response.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Response message.
         * @function verify
         * @memberof messages.Response
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Response.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.seq != null && message.hasOwnProperty("seq"))
                if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                    return "seq: integer|Long expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a Response message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof messages.Response
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {messages.Response} Response
         */
        Response.fromObject = function fromObject(object) {
            if (object instanceof $root.messages.Response)
                return object;
            var message = new $root.messages.Response();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.seq != null)
                if ($util.Long)
                    (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
                else if (typeof object.seq === "string")
                    message.seq = parseInt(object.seq, 10);
                else if (typeof object.seq === "number")
                    message.seq = object.seq;
                else if (typeof object.seq === "object")
                    message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
            if (object.status != null)
                message.status = object.status >>> 0;
            if (object.error != null)
                message.error = String(object.error);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a Response message. Also converts values to other types if specified.
         * @function toObject
         * @memberof messages.Response
         * @static
         * @param {messages.Response} message Response
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Response.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.version = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.seq = options.longs === String ? "0" : 0;
                object.status = 0;
                object.error = "";
                object.message = "";
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.seq != null && message.hasOwnProperty("seq"))
                if (typeof message.seq === "number")
                    object.seq = options.longs === String ? String(message.seq) : message.seq;
                else
                    object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this Response to JSON.
         * @function toJSON
         * @memberof messages.Response
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Response.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Response;
    })();

    return messages;
})();

module.exports = $root;

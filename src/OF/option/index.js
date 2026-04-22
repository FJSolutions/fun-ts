"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.none = exports.some = exports.lift = exports.Maybe = void 0;
var utils_1 = require("../../utils");
/** @internal */
var Maybe = /** @class */ (function () {
    function Maybe(kind, tag, value) {
        var _this = this;
        this.kind = kind;
        this.tag = tag;
        this._value = undefined;
        this.orElse = function (defaultValue) { return _this.isSome ? _this._value : defaultValue; };
        this.map = function (func) {
            if (_this.isSome) {
                var result = func(_this._value);
                if (!(0, utils_1.isNullOrUndefined)(result)) {
                    return (0, exports.some)(result);
                }
            }
            return (0, exports.none)();
        };
        this.flatMap = function (func) {
            if (_this.isSome) {
                return func(_this._value);
            }
            return (0, exports.none)();
        };
        this.match = function (some, none) {
            if (_this.isSome) {
                return some(_this._value);
            }
            else {
                return none();
            }
        };
        this.apply = function (func) {
            if (func.isSome && _this.isSome) {
                var f = func.tap;
                var result = f(_this._value);
                return (0, exports.lift)(result);
            }
            return (0, exports.none)();
        };
        this.filter = function (func) {
            if (_this.isSome && !(0, utils_1.isNullOrUndefined)(_this._value) && func(_this._value)) {
                return (0, exports.some)(_this._value);
            }
            else {
                return (0, exports.none)();
            }
        };
        this.fold = function (func, initialValue) {
            if (_this.isSome && !(0, utils_1.isNullOrUndefined)(_this._value)) {
                var result = func(initialValue, _this._value);
                return (0, exports.lift)(result);
            }
            else {
                return (0, exports.none)();
            }
        };
        this._value = value;
    }
    Object.defineProperty(Maybe.prototype, "isSome", {
        get: function () {
            return this.tag === "Some";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Maybe.prototype, "isNone", {
        get: function () {
            return this.tag === "None";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Maybe.prototype, "tap", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return Maybe;
}());
exports.Maybe = Maybe;
/**
 * Lists a value into an Option
 * @param value The value to lift into an Option
 */
var lift = function (value) { return (0, utils_1.isNullOrUndefined)(value) ? (0, exports.none)() : (0, exports.some)(value); };
exports.lift = lift;
/**
 * Creates a Some Option from a non-nullable or undefined value
 * @param value The non-null/undefined value to put in the Option
 */
var some = function (value) { return new Maybe("Option", "Some", value); };
exports.some = some;
/**
 * Creates a None Option that represents the absence of a value
 */
var none = function () { return new Maybe("Option", "None"); };
exports.none = none;

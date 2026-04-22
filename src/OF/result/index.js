"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lift = exports.failure = exports.success = exports.Either = void 0;
var utils_1 = require("../../utils");
/** @internal */
var Either = /** @class */ (function () {
    function Either(kind, tag, value, errorMessage, error) {
        var _this = this;
        this.kind = kind;
        this.tag = tag;
        this._value = undefined;
        this.match = function (success, failure) {
            var _a;
            if (_this.isSuccess && !(0, utils_1.isNullOrUndefined)(_this._value)) {
                return success(_this._value);
            }
            else {
                return failure((_a = _this._errorMessage) !== null && _a !== void 0 ? _a : "Failure", _this._error);
            }
        };
        this.filter = function (func) {
            var _a;
            if (!(0, utils_1.isNullOrUndefined)(_this._value) && func(_this._value)) {
                return _this;
            }
            else {
                return (0, exports.failure)((_a = _this._errorMessage) !== null && _a !== void 0 ? _a : "This was filtered out", _this._error);
            }
        };
        this.fold = function (func, initialValue) {
            var _a;
            if (_this.isSuccess && !(0, utils_1.isNullOrUndefined)(_this._value)) {
                return (0, exports.success)(func(initialValue, _this._value));
            }
            else {
                return (0, exports.failure)((_a = _this._errorMessage) !== null && _a !== void 0 ? _a : "Failure", _this._error);
            }
        };
        this._value = value;
        this._error = error;
        this._errorMessage = errorMessage;
    }
    Object.defineProperty(Either.prototype, "isFailure", {
        get: function () {
            return (this.tag === "Failure");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "isSuccess", {
        get: function () {
            return (this.tag === "Success");
        },
        enumerable: false,
        configurable: true
    });
    Either.prototype.flatMap = function (func) {
        var _a;
        if (this.isFailure || (0, utils_1.isNullOrUndefined)(this._value)) {
            return (0, exports.failure)((_a = this._errorMessage) !== null && _a !== void 0 ? _a : "Failure", this._error);
        }
        return func(this._value);
    };
    Either.prototype.map = function (func) {
        var _a;
        if (this.isFailure || (0, utils_1.isNullOrUndefined)(this._value)) {
            return (0, exports.failure)((_a = this._errorMessage) !== null && _a !== void 0 ? _a : "Failure", this._error);
        }
        return (0, exports.success)(func(this._value));
    };
    Either.prototype.orElse = function (defaultValue) {
        if (!(0, utils_1.isNullOrUndefined)(this._value)) {
            return this._value;
        }
        else {
            return defaultValue;
        }
    };
    return Either;
}());
exports.Either = Either;
/**
 * Create a Result that has succeeded
 * @param value The value of the successful Result
 */
var success = function (value) {
    return new Either("Result", "Success", value);
};
exports.success = success;
/**
 * Creates a Result that has failed
 * @param errorMessage The error message that explains the failure
 * @param error (Optional) An Error that occurred to cause the failure
 */
var failure = function (errorMessage, error) {
    return new Either("Result", "Failure", undefined, errorMessage, error);
};
exports.failure = failure;
/**
 * Lists a value into a result. The value can throw so lift takes the value as the result of a thunk
 * @param func The thunk from which to get the value to list into a Result
 */
var lift = function (func) {
    try {
        var result = func();
        return (0, exports.success)(result);
    }
    catch (ex) {
        if (ex instanceof Error) {
            return (0, exports.failure)(ex.message, ex);
        }
        else {
            return (0, exports.failure)(String(ex));
        }
    }
};
exports.lift = lift;

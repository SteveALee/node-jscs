/**
 * Requires space after opening square bracket and before closing.
 *
 * Types: `Boolean` or `Object`
 *
 * Values: `true` for strict mode, or `"allExcept": [ "[", "]"]`
 * ignores closing brackets in a row.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInsideBrackets": true
 *
 * // or
 *
 * "requireSpacesInsideBrackets": {
 *     "allExcept": [ "[", "]", "{", "}" ]
 * }
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var x = [ 1 ];
 * ```
 *
 * ##### Valid for mode `{ allExcept": [ "[", "]", "{", "}" ] }`
 *
 * ```js
 * var x = [[ 1 ], [ 2 ]];
 * var x = [{ a: 1 }, { b: 2}];
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = [1];
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule requires string value true or object';

        if (isObject) {
            assert('allExcept' in value, error);
        } else {
            assert(value === true, error);
        }

        this._exceptions = {};

        if (isObject) {
            (value.allExcept || []).forEach(function(value) {
                this._exceptions[value] = true;
            }, this);
        }
    },

    getOptionName: function() {
        return 'requireSpacesInsideBrackets';
    },

    check: function(file, errors) {
        var exceptions = this._exceptions;

        file.iterateTokenByValue('[', function(token) {
            var nextToken = file.getNextToken(token);
            var value = nextToken.value;

            if (value in exceptions) {
                return;
            }

            // Skip for empty array brackets
            if (value === ']') {
                return;
            }

            errors.assert.whitespaceBetween({
                token: token,
                nextToken: nextToken,
                spaces: 1,
                message: 'One space required after opening bracket'
            });
        });

        file.iterateTokenByValue(']', function(token) {
            var prevToken = file.getPrevToken(token);
            var value = prevToken.value;

            if (value in exceptions) {
                return;
            }

            // Skip for empty array brackets
            if (value === '[') {
                return;
            }

            errors.assert.whitespaceBetween({
                token: prevToken,
                nextToken: token,
                spaces: 1,
                message: 'One space required before closing bracket'
            });
        });
    }
};

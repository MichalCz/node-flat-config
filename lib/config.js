// (The MIT License)
//
// Copyright Michał Czapracki, budleigh.salterton@gmail.com
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

"use strict";

var flat = require('./flat'),
    fs = require('fs'),
    configError = require('./error'),
    deflatten = exports.deflatten = flat.deflatten,
    flatten = exports.flatten = flat.flatten,
    join = exports.join = require('./join');

var loadIni = exports.loadIni = require('./model/ini');

var setArgs = exports.setArgs = require('./model/args');

/**
 * Synchronously reads a default config and deep mixes a config file and 
 * arguments. 
 * 
 * @param {String|Object} defaults location of the defaults JSON file, module 
 *                                 path or a config structure.
 * @param {String|Object} config location of the config ini file or
 *                               a flat ini structure.
 * @param {Array} args array of command line arguments (optional)
 * 
 * @returns {Object}
 */
exports.load = function(defaults, config, args) {
    
    if (typeof defaults == 'string')
        try {
            defaults = require(defaults);
        } catch(e) {
            throw configError.notFound(defaults);
        }

    if (!defaults)
        throw configError.noDefaults();
    
    join.ini(defaults, config);
    
    join.args(defaults, args);
    
    return defaults;
};

// backwards compatibility
exports.parseArgs = setArgs;


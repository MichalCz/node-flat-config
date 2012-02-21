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
    deflatten = exports.deflatten = flat.deflatten,
    flatten = exports.flatten = flat.flatten;

var loadDefaultsSync = exports.loadDefaultsSync = require('./model/defaults').sync;
var loadDefaults = exports.loadDefaults = require('./model/defaults').async;

var loadIniSync = exports.loadIniSync = require('./model/ini').sync;
var loadIni = exports.loadIni = require('./model/ini').async;

var setArgs = exports.setArgs = require('./model/args').sync;

/**
 * Synchronously reads a default config and deep mixes a config file and 
 * arguments. 
 * 
 * @param {String|Object} defaults location of the defaults JSON file, module 
 *                                 path or a config structure.
 * @param {String|Object} config location of the config ini file or
 *                               a flat ini structure.
 * @param {Array} args array of command line arguments
 * 
 * @returns {Object}
 */
exports.loadSync = function(defaults, config, args) {
    
    var cfg; 
    args = args || setArgs(process.argv.slice(2));
        
    if (typeof defaults == 'string')
        defaults = require(defaults);
    else if (!defaults)
        throw new Error('loadConfig: defaults must be passed as an object' +
                ' or a file path');
    
    if (typeof config == 'string') {
        cfg = loadIniSync(config, args, true);
    } else {
        for (var key in config) {
            args[key] = config;
        }
        cfg = config;
    }
    
    deflatten(cfg, defaults);
    
    return defaults;
};

exports.parseArgs = function(args, flatobj) {

    args = args || process.argv.slice(2);
    flatobj = flatobj || {};
    
    setArgs(flatobj, args);
    
    return flatobj;
};


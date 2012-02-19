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

/**
 * Reads the default config 
 *  
 * @param {String} defaultsFilename location of the defaults JSON file
 * @param {Array} args array of arguments (
 * @returns
 */
exports.loadConfig = function(defaults, config, args) {
    
    var cfg; 
    args = args || setArgs(process.argv.slice(2));
        
    if (typeof defaults == 'string')
        defaults = JSON.parse(fs.readFileSync(defaults));
    else if (!defaults)
        throw new Error('loadConfig: defaults must be passed as an object'+
                ' or a file path');
    
    if (typeof config == 'string') {
        cfg = fs.readFileSync(config)
                        .toString()
                        .replace(/^\s*([^#])/gm, '--$1')
                        .split("\n");
    } else {
        cfg = config;
    }
    
    if (cfg) {
        setArgs(args, cfg);
    }
    
    deflatten(args, defaults);
    
    return defaults;
};

exports.parseArgs = function(args, flatobj) {

    args = args || process.argv.slice(2);
    flatobj = flatobj || {};
    
    setArgs(flatobj, args);
    
    return flatobj;
};

var setArgs = function(args, list) {
    
    var i, match, aname, aval, aneg, aeq;

    if (arguments.length < 2) {
        list = args;
        args = {};
    }
    
    
    for (i=0; i<list.length; i++) {
        if (match = list[i].match(/^--(no-)?([^=]+)(\s*=\s*(.*))?/)) {
            aname = match[2];
            aeq = match[3];
            aval = match[4];
            aneg = !!match[1];
            
            if (aneg || aeq && !aval)
                aval = false;
            else if (+ aval + "" === aval)
                aval = + aval;
            else if (!aeq && !aval)
                aval = true;
            
            args[aname] = args[aname] || aval;
        }
    }
};

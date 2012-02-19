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

var util = require('util');

/**
 * Composite object creator from posix args.
 * 
 * @param {Array} args with initial "--" like 
 *                {'--logfile': false, '--config-inner-element': 1};
 *                note: the leading hyphens are not necessary. 
 * @param {Object} obj optional object to fill in.
 */
exports.deflatten = function(args, obj) {
    obj = obj || {};
    var key = '', akey = '', tkey = '', aobj;
    
    for (key in args) {
        aobj = obj;
        akey = key.replace(/^-+/, '').split('-');
        while(akey.length > 1) {
            tkey = akey.shift();
            aobj = aobj[tkey] = aobj[tkey] || {};
        }
        aobj[akey.shift()] = args[key];
    }
    
    return obj;
};

exports.flatten = function(obj, args, pfx) {
    args = args || {}, pfx = pfx ? pfx + '-' : '--';
    for (var key in obj) {
        if (obj[key] instanceof Object && !util.isArray(obj[key])) {
            exports.flatten(obj[key], args, pfx + key);
        } else {
            args[pfx + key] = obj[key];
        }
    }
    return args;
};

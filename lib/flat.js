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

var util = require('util'),
    configError = require('./error'),
    flat = exports;

/**
 * Composite object creator from unix --long-style args.
 * 
 * @param {Object} keys: args with initial "--" like 
 *                 {'--logfile': [false], '--config-inner-element': [1]};
 *                 values: arrays.
 *                 note: the leading hyphens are not necessary. 
 * @param {Object} obj optional object to fill in.
 */
flat.deflatten = function(args, obj, delm, set) {
    obj = obj || {};
    delm = delm || '.';
    var key = '', akey;
    
    for (key in args) {
        akey = key.replace(/^-+/, '').split(delm);
        
        if (flat.setval(obj, akey, args[key], set)) 
        	throw configError.invalidDirective(key);
        
    }
    
    return obj;
};

flat.setval = function(aobj, akey, val, set) {
    var tkey = '';
    set = set || '';
    
    while(akey.length) {
        tkey = akey.shift();
        
        if (tkey in aobj || (set + tkey) in aobj) {
            
            if (aobj[set + tkey] instanceof Function) {
                aobj[set + tkey].apply(aobj, akey.concat(val));
                tkey = false;
                break;
            }
            
            if (akey.length)
                aobj = aobj[tkey];
            
        }
    }
    
    if (tkey)
        if (!(tkey in aobj))
            return true;
        else if (util.isArray(aobj[tkey]))
            aobj[tkey] = aobj[tkey].concat(val);
        else
            aobj[tkey] = val[0];
	
    return false;
};

/**
 * Unix --long-style args creator from a composite object
 * 
 * @param {Object} obj object to create flat args from.
 * @param {Array} args an optional object to fill in.
 * @param {String} pfx an optional prefix for args (default="--")
 * @param {String} delm an optional delimiter for keys (default=".")
 * @param {String} priv an optional prefix for private vars (default="_")
 * 
 * @returns {Array} 
 */
flat.flatten = function(obj, args, pfx, delm, priv) {
    delm = delm || '.';
    args = args || {};
    pfx = pfx ? pfx + delm : '';
    priv = priv || '_';
    
    for (var key in obj) {
        if (obj[key] instanceof Object && !util.isArray(obj[key])) {
            flat.flatten(obj[key], args, pfx + key);
        } else if (key.indexOf(priv)) {
            args[pfx + key] = obj[key];
        }
    }
    return args;
};

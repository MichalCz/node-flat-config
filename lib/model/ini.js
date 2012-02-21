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

var fs = require('fs'),
    util = require('util');

/**
 * A synchronous function that reads an ini file to a flat array.
 * It automatically resolves sections
 * 
 * @param {String} path file path
 * @returns {Array}
 */
exports.sync = function(path, flatobj, required, sect_delm, item_delm) {
    
    var lines = readFile(path);
    
    flatobj = flatobj || [];
    
    if (lines) {
        readIni(lines, flatobj, sect_delm, item_delm);
    } else if (required) {
        throw configError.notFound(path);
    }

    return flatobj;
};

var line_re = /\n|\r\n|\r/,
    cmmt_re = /[;#].*$/gm,
    sect_re = /^\s*\[(.+)\]\s*/,
    renv_re = /\$\{[^}]+\}/g,
    item_re = /^\s*(\b[^=]+\b)(\s*?=\s*(.*[^\s]))?\s*$/;

var readFile = function(path, callback) {
    if (callback)
        return fs.readFile(path, 'utf-8', parseFile.bind(null, callback));
    
    try {
        var file = fs.readFileSync(path, 'utf-8');
        return parseFile(file);
    } catch(e) {
        return;
    }
};

var parseFile = function(callback, err, data) {
    if (!(callback instanceof Function)) {
        data = callback;
        callback = false;
    }
    
    if (err || !data) {
        callback();
    }
    
    var lines = data.toString()
                .replace(cmmt_re, '')
                .split(line_re);
    
    if (!lines.length)
        lines = false;
    
    return callback ? callback(lines) : lines; 
};

var readIni = function(lines, flatobj, sect_delm, item_delm) {
    sect_delm = sect_delm || ' ';
    item_delm = item_delm || '.';
    
    var item = '', section = '', key = '', val, match;
    
    while(lines.length) {
        item = lines.shift();
        if (match = item.match(sect_re)) {
            section = match[1].replace(sect_delm, '.') + '.';
        } else if (match = item.match(item_re)) {
            key = section + match[1];
            
            // take care of environment variables
            if (match[3]) {
                match[3] = match[3].replace(renv_re, function(v) {
                    v = v.slice(2, -1);
                    return v in process.env ? process.env[v] : '';
                });
            }
            
            // some-value             
            if (!match[2])
                val = true;
            // some-value = true
            else if (match[3] == 'false' || match[3] == 'true')
                val = match[3] == 'true';
            // some value = 703
            else if (+ match[3] + "" === match[3])
                val = + match[3];
            // some value = a simple string 
            else
                val = match[3];
            
            (flatobj[key] = flatobj[key] || [])
                .push(val);
        }
    }
    
    return flatobj;
};

var setArgs = exports.setArgs = function(args, list) {
    
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

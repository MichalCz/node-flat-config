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

/**
 * @fileoverview
 * @author Michał Czapracki
 *
 * A chained config example
 * 
 * Try invoking this file like:
 *   node simple --config=./myvars
 * or
 *   node examples/chained/test --config=./examples/chained/myvars --no-all-fixes-global --all-fixes-heap --quiet=
 */

var path = require('path');

var flatconfig = require('flatconfig'),
    args = flatconfig.setArgs(process.argv.slice(2));

if (!args['config']) {
    console.log('Usage: ' + process.argv.slice(0, 2).join(' ') 
                + ' --config=path/to/config [--config=path/to/config2 ...]');
    
    process.exit(1);
}

var cfgpath = args['config'];

delete args['config'];

var config = require(__dirname + '/cfg.js'), configs = [];

while (cfgpath.length) {
	var c = cfgpath.shift();
	if (!c || ~configs.indexOf(c))
		continue;
	
	configs.push(c);
	
	flatconfig.join.ini(config, path.resolve(process.cwd(), c));
	
	if (config._includes)
		cfgpath.concat(config._includes);
		delete config._includes;
}

flatconfig.join.args(config, args);

if (!config.quiet) {
	var flat = flatconfig.flatten(config);
	
    console.log('The configuration resolved to: ');
    
    for (var k in flat) {
        console.log('  ', k, '=', JSON.stringify(flat[k]));
    }
    
    console.log('');
    console.log('The resulting JSON is: ');
}

console.log(JSON.stringify(config));

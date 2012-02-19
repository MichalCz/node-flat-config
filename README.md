Flat Config Parser
====================

The goal of this project is to provide a simple module that can load a JSON 
defaults file, read a flat configuration file and parse command line arguments.

Synopsis
----------

Usually an application needs a basic `defaults` structure, some `config files` 
that override defaults and `command line arguments` that override the resulting
object.

The usual scenario is when **Flat Config** loads a JSON file for defaults,
then loads a `key-subkey=value` style configuration file and mixes that with 
command line arguments.

You may also provide **Flat Config** with any existing javascript object and
it will work. You can also provide an array of configuration entries instead of
the config file if you feel more comfortable with that.

API
-----

A basic example, the defaults:

    {
        "app": {
            "mainmodule": "lib/main", 
            "port": 8080
        }, 
        "limit": {
            "connections": 30,
            "entries": 4096
        },
        "quiet": true,
        "test": true
    }

The config file (/etc/myapp/myconfig):
    
    app-port=3080
    limit-connections=20
    entries=1024

The application loader (say app.js):

    // Initialize flatconfig
    var flatconfig = require('flatconfig');
    
    // Load the configuration
    var args = flatconfig.parseArgs(process.argv.slice(2)),
        config = flatconfig.loadConfig(
                  path.resolve(__dirname, 'cfg.json'), 
                  path.resolve(process.cwd(), args['config']),
                  args),
    
    var app = require(config.app.mainmodule);
    app.init(config);

The invocation:
    
    node app --config=/etc/myapp/myconfig --no-test --no-quiet --app-port=4080

### The arguments/config file parser



### flatconfig.loadConfig(defaults, [config, [args]])

Returns the resulting config object.

Parameters are:
 
* {Object|String} **defaults**: the base object to load
  - if an object it passed it will modify it
  - if a string is passed it will attempt to load a JSON file
* {Object|String} **config**: the configuration to mixin
  - a object listing the configuration directives is expected, or
  - a path pointing to the configuration file (absolute)
  - the argument is optional, empty values will be ignored
* {Array} **args**: the command line arguments
  - the command line arguments
  - if not given the default value is `process.argv.slice(2)`

### flatconfig.parseArgs(args, [flatobj])

### flatconfig.flatten(args, [obj])

### flatconfig.deflatten(obj, [args, [prefix]])



License
=========

(The MIT License)

Copyright (c) 2012 Michał Czapracki budleigh.salterton@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

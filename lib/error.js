
var configError = module.exports;

configError.notFound = function(path) {
    var e = new Error('Cannot read ' + path);
    e.type = configError.notFound.type;
    return e;
};

configError.invalidDirective = function(key) {
    var e = new Error('Invalid configuration directive: "' + key + '"');
    e.type = configError.invalidDirective.type;
    return e;
};

configError.noDefaults = function(key) {
    var e = new Error('Could not load defaults: "' + key + '"');
    e.type = configError.noDefaults.type;
    return e;
};

// error types for checking
configError.notFound.type = 'ENOENT';
configError.invalidDirective.type = 'EINDIR';
configError.invalidDirective.type = 'ENODEF';


var configError = module.exports;

configError.notFound = function(path) {
    var e = new Error('Cannot read ' + path);
    e.type = configError.notFound.type;
};

// error types for checking
configError.notFound.type = 'ENOENT';

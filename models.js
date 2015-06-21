
var r = require('rethinkdb');
var Promise = require('bluebird');

module.exports = function (){

    return r.connect({ 
        host: 'localhost',
        port: 28015,
        db: 'FJCU'
    })
    .then(function (conn) {
        console.log(conn);
        return conn;
    })
    .error(function (err) {
        console.log(err);
        process.exit();
    });
};
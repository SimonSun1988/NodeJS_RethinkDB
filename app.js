
var express = require('express');
var r = require('rethinkdb');
var bodyParser = require('body-parser');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Just connect to RethinkDB
var conn;
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'FJCU'
}, function (err, conneciton){
    conn = conneciton;
    r.table('posts').changes().run(conn, function (err, cursor) {
        cursor.each(function (err, row) {
            if (err) throw err;
            console.log(row);
        });
    });
});


app.post('/', function ( req, res, next ) {
    var name = req.body.name;
    var age = req.body.age;
    r.table('posts').insert({
        name: name, age: age
    }, { returnChanges: true }).run(conn, function (err, doc) {
        console.log(err);
        return res.json(doc);
    });
});

app.get('/', function ( req, res, next ) {
    r.table('posts').run(conn, function (err, cursor){
        cursor.toArray(function (err, docs){
            return res.send(docs);
        });
    });
});



app.listen(9291);
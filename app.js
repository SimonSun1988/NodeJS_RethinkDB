
var express = require('express');
var r = require('rethinkdb');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// 設定 view engine 與檔案的路徑
app.set('view engine', 'jade');
app.set('views', './views');


// 創造一個 event
var EventEmitter = require('events').EventEmitter;
var bomb = new EventEmitter();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// 連線到 rethinkDB 並且監聽 people 這個 table
var conn;
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'FJCU'
}, function (err, conneciton){
    conn = conneciton;
    r.table('people').changes().run(conn, function (err, cursor) {
        cursor.each(function (err, row) {
            if (err) throw err;

            bomb.emit('insertData', { data: row } );
        });
    });
});


app.post('/', function ( req, res, next ) {
    var name = req.body.name;
    var age = req.body.age;
    r.table('people').insert({
        name: name,
        age: age,
        date: new Date()
    }, { returnChanges: true }).run(conn, function (err, doc) {
        console.log(err);
        return res.json(doc);
    });
});

app.get('/', function ( req, res, next ) {
    r.table('people').orderBy('date').run(conn, function (err, cursor){
        cursor.toArray(function (err, docs){
            return res.render('index', { people: docs });
        });
    });
});



server.listen(9291);

io.on('connection', function (socket) {

    bomb.on('insertData', function(data) {
        console.log('data', data.data);
        var newData = data.data.new_val;
        socket.emit('newData', newData);
    });
});
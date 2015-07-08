
var express = require('express');
var r = require('rethinkdb');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// 設定 view engine 與檔案的路徑
app.set('view engine', 'jade');
app.set('views', './views');


// 創造一個叫做 Service 的 event
var EventEmitter = require('events').EventEmitter;
var Service = new EventEmitter();

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

    if(err){
        console.log(err);
        process.exit();
    }

    conn = conneciton;
    r.table('people').changes().run(conn, function (err, cursor) {
        cursor.each(function (err, row) {

            if(err){
                console.log(err);
                process.exit();
            }

            Service.emit('insertData', { data: row } );
        });
    });
});


app.post('/', function ( req, res, next ) {

    // 處理 post 過來的資料
    var name = req.body.name || 'NO_NAME';
    var age = req.body.age || 'NO_AGE';

    // 將資料存入 db 內
    r.table('people').insert({
        name: name,
        age: age,
        date: new Date()
    }, { returnChanges: true }).run(conn, function (err, doc) {

        if(err){
            console.log(err);
            process.exit();
        }

        return res.status(204).send();
    });
});

app.get('/', function ( req, res, next ) {
    r.table('people').orderBy('date').run(conn, function (err, cursor){

        if(err){
            console.log(err);
            process.exit();
        }

        cursor.toArray(function (err, docs){

            if(err){
                console.log(err);
                process.exit();
            }

            return res.render('index', { people: docs });
        });
    });
});


console.log('Listen port 9291');
server.listen(9291);

io.on('connection', function (socket) {

    Service.on('insertData', function(data) {
        console.log('data', data.data);
        var newData = data.data.new_val;
        socket.emit('newData', newData);
    });
});


/*
 * 載入需要用到的 node modules
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


/* 
 * 設定 view engine 與檔案的路徑
 */
app.set('view engine', 'jade');
app.set('views', './views');


/*
 * 設定 http body parser
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/*
 * 載入 service 這個 Event 
 * 在 ./service/index.js 這個檔案
 */
var service = require('./service');


/*
 * 載入 RethinkDB 相關設定
 * 在 ./db/index.js 這個檔案
 */
require('./db');


/*
 * 載入 router 相關設定
 * 在 ./controllers/index.js 這個檔案
 */
app.use(require('./controllers'));


/*
 * 啟動這個 node service
 */
console.log('Listen port 9291');
server.listen(9291);


/*
 * socket.io 處理
 */
io.on('connection', function (socket) {

    service.on('insertData', function(data) {
        console.log('data', data.data);
        var newData = data.data.new_val;
        socket.emit('newData', newData);
    });
});


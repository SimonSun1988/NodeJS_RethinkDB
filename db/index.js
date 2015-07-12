
var r = require('rethinkdb');
var service = require('../service');

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'FJCU'
}, function (err, conneciton){

    if(err){
        console.log(err);
        process.exit();
    }

    global.connection = conneciton;
    r.table('people').changes().run(global.connection, function (err, cursor) {
        cursor.each(function (err, row) {

            if(err){
                console.log(err);
                process.exit();
            }

            console.log(row);

            service.emit('insertData', { data: row } );
        });
    });
});

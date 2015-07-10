
var r = require('rethinkdb');

module.exports = function (req, res, next) {

        // 處理 post 過來的資料
        var name = req.body.name || 'NO_NAME';
        var age = req.body.age || 'NO_AGE';

        // 將資料存入 db 內
        r.table('people').insert({
            name: name,
            age: age,
            date: new Date()
        }, { returnChanges: true }).run(global.connection, function (err, doc) {

            if(err){
                console.log(err);
                process.exit();
            }

            return res.status(204).send();
        });

};
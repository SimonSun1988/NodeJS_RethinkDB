
var r = require('rethinkdb');

module.exports = function (req, res, next) {

    r.table('people')
        .orderBy(r.desc('date'))
        .run(global.connection, function (err, cursor){

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
};



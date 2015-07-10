var express = require('express');
var router = express.Router();

router.route('/')
    .get(require('./home'))
    .post(require('./insert'))
;

module.exports = router;
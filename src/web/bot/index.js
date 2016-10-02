'use strict';
var router = require('express').Router();

router.get('/',(req,res) => {
    res.render('call');
})

module.exports = router;

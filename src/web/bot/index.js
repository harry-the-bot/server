'use strict';
var router = require('express').Router();

router.get('/bot',(req,res) => {
    res.render('call');
})

module.exports = router;

'use strict';
var router = require('express').Router();

router.get('/',(req,res) => {
    res.send("Olá robô!");
})

module.exports = router;

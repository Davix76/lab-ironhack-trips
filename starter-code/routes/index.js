const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
console.log("index router");
    res.render('index');

});

module.exports = router;

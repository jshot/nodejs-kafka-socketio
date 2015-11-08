var express = require('express');
var router = express.Router();

var v1 = require('./v1.js');
router.get('/v1/search/:productID', v1.search.find);
 
module.exports = router;

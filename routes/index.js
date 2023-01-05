var express = require('express');
var router = express.Router();
const {use} = require("express/lib/router");
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("hi");
  res.render('login', { title: 'Express' });
});


module.exports = router;

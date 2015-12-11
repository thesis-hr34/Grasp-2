var express = require('express');
var app = express();

var db = require('./database/dbsetup.js');



app.listen(3000);
console.log("Listening on 3000");

module.exports = app;
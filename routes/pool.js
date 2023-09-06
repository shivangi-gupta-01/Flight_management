var mysql = require("mysql")
var pool = mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'shivangi@831',
    database:'flightproject',
    multipleStatements:'true',
    connectionlimit: 100
})
module.exports = pool;
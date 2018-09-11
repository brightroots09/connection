const mysql = require('mysql');

global.con = mysql.createConnection({
    // "host": "127.0.0.1",
    // "port": 3306,
    // "database": "brightde_SC_2",
    // "password": "root",
    // "user": "root",
    // "connector": "mysql",
    // "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"

    host : 'localhost',
    user : 'brightde_scuser',
    password : '*]}Q]cPR{(vR',
    database : 'brightde_SC'

});

let connection = async function () {
    try {
        await con.connect();
        console.log("Connected to SQL");

    } catch (error) {
        console.log("Error in connecting to database");
        return error;
    }

}
module.exports = connection;
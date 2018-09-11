var mysql = require('mysql');
/*var options = {
    host : 'localhost',
    user : 'brightde_scuser',
    password : '*]}Q]cPR{(vR',
    database : 'brightde_SC'
};
var sqlclient = require('mysql-queries').init(options);
var connection = mysql.createConnection({ 
    host : 'localhost',
    user : 'brightde_scuser',
    password : '*]}Q]cPR{(vR',
    database : 'brightde_SC',
});
*/
var connection=mysql.createPool({
    host : 'localhost',
    user : 'brightde_scuser',
    password : '*]}Q]cPR{(vR',
    database : 'brightde_SC'
});
 module.exports=connection;
var jwt = require('jwt-simple');
var db = require('./db');

var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password);
   if (!dbUserObj) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    if (dbUserObj) {
 
      // If authentication is success, we will generate a token
      // and dispatch it to the client
 
      res.json(genToken(dbUserObj));
    }
 
  },
 
  validate: function(username, password) {
    // spoofing the DB response for simplicity
   var query = db.query("SELECT * from admin WHERE Email=? AND Password=?",[username,password],function(err, rows, fields)
		{
		   console.log(rows); 
			if(err)
			{
				
				dbUserObj = [];
            }
			else
			{
			    var dbUserObj = { // spoofing a userobject from the DB. 
                      name: rows[0].Fname + ' ' + rows[0].Lname,
                      role: 'admin',
                      username: rows[0].Email,
                      Id : rows[0].Id
                    };
			  
            }
            return dbUserObj;
        });
       
  },
 
  validateUser: function(username) {
    // spoofing the DB response for simplicity
    db.query("SELECT * from User WHERE Email=?",[username],function(err, rows, fields)
		{
			if(rows.length > 0)
			{
				var dbUserObj = { // spoofing a userobject from the DB. 
                      name: rows[0].Fname + ' ' + rows[0].Lname,
                      role: 'admin',
                      username: rows[0].Email,
                      Id : rows[0].Id
                    };
				
            }
			else
			{
				 dbUserObj = [];
            }
            return dbUserObj;
        });
    
  },
}
 
// private method
function genToken(user) {
     var expires = expiresIn(1); // 7 days
     var token = jwt.encode({exp: expires}, require('../config/secret')());
    db.query("SELECT * from Token WHERE UserId=?",[user.Id],function(err, rows, fields)
		{
			if(rows.length > 0)
			{
				db.query("UPDATE INTO SET Token=?, ExpiresIn=? WHERE UserId=?",[token,expires,user.Id],function(error, result, fields)
							{
							 if(error)
							 {
								 //data["Message"] = error;
								 //res.json(data);
							 }
							 else
							 {
								//data["Status"] = 1;
				                //data["Message"] = { "id" : rows[0].id , "user_name" : rows[0].user_name , "email" : rows[0].email , "password" : rows[0].password , "dob" : rows[0].dob , "gender" : rows[0].gender , "city" : rows[0].city , "country" : rows[0].country , "profile_image" : "http://hu5h.com/img/user/"+rows[0].profile_image , "device_id" : device_id , "device_type" : device_type }; 
							   //res.json(data);
							 }
								 
								
							});
				
            }
			else
			{
				   db.query("INSERT INTO Token VALUES('',?,?,?)",[token,user.Id,expires],function(err, rows, fields)
        	       {
           
        	       });
            }
            
        });
      
  return {token: token,expires: expires,user: user};
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;
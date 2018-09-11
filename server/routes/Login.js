var db = require('./db');
var path = require('path');
var auth = require('./auth');
var jwt = require('jwt-simple');
var sleep = require('sleep');

var Login = {
  
  
   Action : function(req , res) {
      
    var email = req.body.email;
    var password = req.body.password;
    var data = {"Status":0,"Message":""};
    if(!!email && !!password)
	{
	  var query = db.query("SELECT * from User WHERE Email=? AND Password=?",[email,password],function(err, rows, fields)
		{
		   //console.log(rows); 
			if(err)
			{
				
				data["Message"] = "Invalid credentials";
                res.json(data);  
            }
			else
			{
			    data["Status"] = 1;
			    data["Message"] = rows;
			    data["url"] = "https://brightdeveloper.work/server/img/";
                res.json(data);
                /*
                
			    var dbUserObj = { // spoofing a userobject from the DB. 
                      name: rows[0].Fname + ' ' + rows[0].Lname,
                      role: 'admin',
                      username: rows[0].Email,
                      Id : rows[0].Id
                    };
			  */
            }
           // return dbUserObj;
        });
	  
	  /*  
        var dbUserObj = auth.validate(email, password);
        
        if (!dbUserObj) 
        {
         data["Message"] = "Invalid credentials";
         res.json(data);  
         return;
        }
     
        if (dbUserObj) 
        {
            data["Status"] = 1;
            data["Message"] = genToken(dbUserObj);
            res.json(data); 
            return;
        }
        */
		
    }
	else
	{
        data["Message"] = "Please Provide All Required Data (i.e : name, email, password)";
        res.json(data);
    }    
       
  },
    Logout : function(req,res)
    {
        var user_id = req.body.user_id;
        var data = {"Status":0,"Message":""};
        if(!!user_id)
            {
                 db.query("UPDATE User SET DeviceType='' , DeviceId ='' WHERE Id=?",[user_id],function(err, rows, fields)
                   {

                   });

                 data["Status"] = 1;
                 data["Message"] = "Logout Successfully";
                 res.json(data);
            }
        else
            {
                 data["Message"] = "Please Provide All Required Data (i.e : user_id)";
                 res.json(data);
            }
         
    }
};

 
module.exports = Login;
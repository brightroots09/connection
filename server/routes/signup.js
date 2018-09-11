var db = require('./db');
var path = require('path');
var multer  = require('multer');
var fs = require('fs');
var datetime = require('node-datetime');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'server/img/');
  },
  filename: function (req, file, callback) {
      var dt = datetime.create();
      var formatted = dt.format('m_d_Y_H_M_S');
      callback(null, file.originalname + '-' + formatted+path.extname(file.originalname ));
  }
});
var upload = multer({ storage : storage , limits: {fileSize: 100000000}}).any();

//var upload = multer({ dest: 'uploads/' })

var signup = {
  
  
   Test : function(req,res)
    {
        res.json(path);
        console.log(path);
    },
   UpdateUserdata: function(req,res)
   {
        var user_id = req.body.user_id
        
        var data = {
        "Status":0,
        "Message":""
        };
        var first_name = req.body.first_name;
        
        if(!!first_name)
        {
            db.query("UPDATE User SET Fname=? WHERE Id=?",[first_name,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var last_name = req.body.last_name;
        
        if(!!last_name)
        {
            db.query("UPDATE User SET Lname=? WHERE Id=?",[last_name,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        
        var email = req.body.email;
        
         if(!!email)
        {
            db.query("UPDATE User SET Email=? WHERE Id=?",[email,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var password = req.body.password;
        
        
         if(!!password)
        {
            db.query("UPDATE User SET Password=? WHERE Id=?",[password,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var contact_no = req.body.contact_no;
      
        
         if(!!contact_no)
        {
            db.query("UPDATE User SET ContactNo=? WHERE Id=?",[contact_no,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        var user_type = req.body.user_type;
       
        
         if(!!user_type)
        {
            db.query("UPDATE User SET UserType=? WHERE Id=?",[user_type,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var device_id = req.body.device_id;
  
        
         if(!!device_id)
        {
            db.query("UPDATE User SET DeviceId=? WHERE Id=?",[device_id,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var device_type = req.body.device_type;
        
         if(!!device_type)
        {
            db.query("UPDATE User SET DeviceType=? WHERE Id=?",[device_type,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var Latitude = req.body.Latitude;
        
         if(!!Latitude)
        {
            db.query("UPDATE User SET Latitude=? WHERE Id=?",[Latitude,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        
        var Longitude = req.body.Longitude;
        
         if(!!Longitude)
        {
            db.query("UPDATE User SET Longitude=? WHERE Id=?",[Longitude,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var LicenceNo = req.body.LicenceNo;

        
         if(!!LicenceNo)
        {
            db.query("UPDATE User SET LicenceNo=? WHERE Id=?",[LicenceNo,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var CompanyName = req.body.CompanyName;
    
        
         if(!!CompanyName)
        {
            db.query("UPDATE User SET CompanyName=? WHERE Id=?",[CompanyName,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var Skill  = req.body.Skill;

        
         if(!!Skill)
        {
            db.query("UPDATE User SET Skill=? WHERE Id=?",[Skill,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var NoOfTechnicians = req.body.NoOfTechnicians;
        
        
         if(!!NoOfTechnicians)
        {
            db.query("UPDATE User SET NoOfTechnicians=? WHERE Id=?",[NoOfTechnicians,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var Address = req.body.Address;
      
        
         if(!!Address)
        {
            db.query("UPDATE User SET Address=? WHERE Id=?",[Address,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
        var Experience = req.body.Experience;
       
         if(!!Experience)
        {
            db.query("UPDATE User SET Experience=? WHERE Id=?",[Experience,user_id],function(err, rows, fields)
	       {
   
	       });
        }
       
       
        var services_provided = req.body.services_provided;
       
         if(!!services_provided)
        {
            db.query("UPDATE User SET services_provided=? WHERE Id=?",[services_provided,user_id],function(err, rows, fields)
	       {
   
	       });
        }
        
       
       var services_names = req.body.services_names;
       
         if(!!services_provided)
        {
            db.query("UPDATE User SET services_names=? WHERE Id=?",[services_names,user_id],function(err, rows, fields)
	       {
   
	       });
        }
       
       
       var ProfilePic = req.body.ProfilePic;
        if(!!ProfilePic)
        {
                 db.query("UPDATE User SET ProfilePic=? WHERE Id=?",[ProfilePic,user_id],function(err, rows, fields)
	              {
   
	               });
        }
       
       var LicenceImage = req.body.LicenceImage;
        if(!!LicenceImage)
        {
                 db.query("UPDATE User SET LicenceImage=? WHERE Id=?",[LicenceImage,user_id],function(err, rows, fields)
	              {
   
	               });
        }
       
       
       var OtherCertificate = req.body.OtherCertificate;
        if(!!OtherCertificate)
        {
                 db.query("UPDATE User SET OtherCertificate=? WHERE Id=?",[OtherCertificate,user_id],function(err, rows, fields)
	              {
   
	               });
        }
        /*
        if(req.files.ProfilePic != undefined)
        {
            var sampleFile;
             sampleFile = req.files.ProfilePic;
        	 var filename = req.files.ProfilePic.name;
        	 if(filename !="")
        	 {
        	   var imagename  = filename+Date.now()+path.extname(filename);
        	   
        	   sampleFile.mv(__dirname + '/../img/user/'+imagename, function(err)
        	   {
        	       db.query("UPDATE User SET ProfilePic=? WHERE Id=?",[imagename,user_id],function(err, rows, fields)
	              {
   
	               });
        	       
        	    });
        	    
        	 }
        	 
         }
       
        if(req.files.LicenceImage != undefined)
        {
             var sampleFile1;
             sampleFile1 = req.files.LicenceImage;
        	 var filename1 = req.files.LicenceImage.name;
        	 if(filename1 !="")
        	 {
        	   var imagename1 = filename1+Date.now()+path.extname(filename1);
        	   
        	   sampleFile1.mv(__dirname + '/../img/user/'+imagename1, function(err)
        	   {
        	        db.query("UPDATE User SET LicenceImage=? WHERE Id=?",[imagename1,user_id],function(err, rows, fields)
	               {
   
	               });
        	    });
        	    
        	 }
        	 
        }
        
         if(req.files.OtherCertificate != undefined)
	    {
	      var sampleFile2;
         sampleFile2 = req.files.OtherCertificate;
    	 var filename2 = req.files.OtherCertificate.name;
    	 if(filename2 !="")
    	 {
    	   var imagename2 = filename2+Date.now()+path.extname(filename2);
    	   
    	   sampleFile2.mv(__dirname + '/../img/user/'+imagename2, function(err)
    	   {
    	        db.query("UPDATE User SET OtherCertificate=? WHERE Id=?",[imagename2,user_id],function(err, rows, fields)
	              {
   
	               });
    	   });
    	    
    	 }
    	 
	     }*/
	     
	       data["Status"] = 1;
	       data["Message"] = "Data Has Been Updated  Successfully . ";
           res.json(data);
        
       
   },
    UploadImage : function(req , res ,next) 
    {
        
        
       /* req.files.userPhoto.forEach(function (element, index, array) {
         fs.readFile(element.path, function (err, data) {
          var newPath = __dirname + "uploads/" + element.name;
          fs.writeFile(newPath, data, function (err) {
          if(err) {
            console.log(err);
          }
        });
      });
             });*/
        
         upload(req,res,function(err) {
        //console.log(req.body);
       // console.log(req);
        if(err) {
            res.json("Error uploading file.");
        }
        res.json(req.files);
      });
        //console.log(req);
        
       //res.json(req.files);
       
    },
  
   SignupTechnician: function(req , res) {
      
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    var contact_no = req.body.contact_no;
    var user_type = req.body.user_type;
    var device_id = req.body.device_id;
    var device_type = req.body.device_type;
    var Latitude = req.body.Latitude;
    var Longitude = req.body.Longitude;
    
    var LicenceNo = req.body.LicenceNo;
    var CompanyName = req.body.CompanyName;
    var Skill  = req.body.Skill;
    var Address  = req.body.Address;
    var imagename = req.body.ProfilePic;
    var imagename1 = req.body.LicenceImage;
    var Country = req.body.Country;
    var States = req.body.States;
    var City = req.body.City;
    
    
   /*
   if(req.files.ProfilePic != undefined)
   {
        var sampleFile;
         sampleFile = req.files.ProfilePic;
    	 var filename = req.files.ProfilePic.name;
    	 if(filename !="")
    	 {
    	   var imagename  = filename+Date.now()+path.extname(filename);
    	   
    	   sampleFile.mv(__dirname + '/../img/user/'+imagename, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	       
    	    });
    	    
    	 }
    	 
   }
   else
    	 {
    	     imagename = "";
    	 }
   
     
    if(req.files.LicenceImage != undefined)
    {
         var sampleFile1;
         sampleFile1 = req.files.LicenceImage;
    	 var filename1 = req.files.LicenceImage.name;
    	 if(filename1 !="")
    	 {
    	   var imagename1 = filename1+Date.now()+path.extname(filename1);
    	   
    	   sampleFile1.mv(__dirname + '/../img/user/'+imagename1, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	    });
    	    
    	 }
    	 
    }
    else
    	 {
    	     imagename1 = "";
    	 }
     
      */


    
    
    var data = {
        "Status":0,
        "Message":""
        };
        console.log(req);
    if(!!first_name && !!last_name && !!email && !!password)
	{
		
		db.query("SELECT * from User WHERE Email=?",[email],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
                          		data["Message"] = "Email Already Register Please Try Other Email Address .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						     db.query("INSERT INTO User VALUES('',?,?,?,?,?,?,?,?,?,?,'','',?,?,?,?,?,?,'','','',?,?,?)",[first_name,last_name,email,password,contact_no,imagename,CompanyName,Address,LicenceNo,imagename1,Skill,user_type,device_id,device_type,Latitude,Longitude,Country,States,City],function(err, rows, fields)
												  {
													if(!!err)
													{
														data["Message"] = "Error Adding Data";
														res.json(data);
													}
													else
													{
														data["Status"] = 1;
														data["Message"] = "User Has Been Register Successfully";
														data["user_id"] = rows.insertId;
														data["Body"] = req.body;
														data["url"] = "https://brightdeveloper.work/server/img/";
														data["image"] = {"ProfilePic":imagename,"LicenceImage":imagename1}
														res.json(data);
													}
													
												});		
						 }	
					  });
    }
	else
	{
        data["Message"] = "Please Provide All Required Data (i.e : name, email, password)";
        res.json(data);
    }    
       
  },
  
  SignupContractor: function(req , res) {
      
    
    //var first_name = req.body.first_name;
    //var last_name = req.body.last_name;
    var email = req.body.email;
    var contact_no = req.body.contact_no;
    var user_type = req.body.user_type;
    var device_id = req.body.device_id;
    var device_type = req.body.device_type;
    var Latitude = req.body.Latitude;
    var Longitude = req.body.Longitude;
    
    var LicenceNo = req.body.LicenceNo;
    var NoOfTechnicians = req.body.NoOfTechnicians;
    var Address = req.body.Address;
    var CompanyName = req.body.CompanyName;
    var Experience = req.body.Experience;
    var services_provided =   req.body.services_provided;
    var services_names =   req.body.services_names;
    var imagename = req.body.ProfilePic;
    var imagename2 = req.body.OtherCertificate;
    var imagename1 = req.body.LicenceImage;
    var Country = req.body.Country;
    var States = req.body.States;
    var City = req.body.City;
    
    
    
    
    /*
    if(req.files.ProfilePic != undefined)
    {
        var sampleFile;
         sampleFile = req.files.ProfilePic;
    	 var filename = req.files.ProfilePic.name;
    	 if(filename !="")
    	 {
    	   var imagename = filename+Date.now()+path.extname(filename);
    	   
    	   sampleFile.mv(__dirname + '/../img/user/'+imagename, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	    });
    	    
    	 }
    	  
    }
    else
    	 {
    	     imagename ="";
    	 }
    
    
	 
	 
	 if(req.files.OtherCertificate != undefined)
	 {
	      var sampleFile2;
         sampleFile2 = req.files.OtherCertificate;
    	 var filename2 = req.files.OtherCertificate.name;
    	 if(filename2 !="")
    	 {
    	   var imagename2 = filename2+Date.now()+path.extname(filename2);
    	   
    	   sampleFile2.mv(__dirname + '/../img/user/'+imagename2, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	   });
    	    
    	 }
    	 
	 }
	 else
    	 {
    	    imagename2 =""; 
    	 }
	 
	
	 
	 if(req.files.LicenceImage != undefined)
	 {
	      var sampleFile1;
         sampleFile1 = req.files.LicenceImage;
    	 var filename1 = req.files.LicenceImage.name;
    	 if(filename1 !="")
    	 {
    	   var imagename1 = filename1+Date.now()+path.extname(filename1);
    	   
    	   sampleFile1.mv(__dirname + '/../img/user/'+imagename1, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	    });
    	    
    	 }
    	 
	 }
	 else
    	 {
    	      imagename1 = "";
    	 }
	 
	*/
	
    
    
    var data = {
        "Status":0,
        "Message":""
        };
        console.log(req);
    if(!!email)
	{
		
		db.query("SELECT * from User WHERE Email=?",[email],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
                          		data["Message"] = "Email Already Register Please Try Other Email Address .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						     db.query("INSERT INTO User VALUES('','','',?,'',?,?,?,?,?,?,?,?,'',?,?,?,?,?,?,?,?,?,?,?)",[email,contact_no,imagename,CompanyName,Address,LicenceNo,imagename1,NoOfTechnicians,imagename2,user_type,device_id,device_type,Latitude,Longitude,Experience,services_provided,services_names,Country,States,City],function(err, rows, fields)
												  {
													if(!!err)
													{
														data["Message"] = "Error Adding Data : " + err;
														res.json(data);
													}
													else
													{
														data["Status"] = 1;
														data["Message"] = "User Has Been Register Successfully";
														data["user_id"] = rows.insertId;
														data["Body"] = req.body;
														data["url"] = "https://brightdeveloper.work/server/img/";
														data["image"] = {"ProfilePic":imagename,"LicenceImage":imagename1,"OtherCertificate":imagename2}
														res.json(data);
													}
													
												});		
						 }	
					  });
    }
	else
	{
        data["Message"] = "Please Provide All Required Data (i.e : name, email, password)";
        res.json(data);
    }    
       
  },
  
  Signupuser: function(req, res) {
      console.log(req);
    //var sampleFile;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    var contact_no = req.body.contact_no;
    var user_type = req.body.user_type;
    var device_id = req.body.device_id;
    var device_type = req.body.device_type;
    var Latitude = req.body.Latitude;
    var Longitude = req.body.Longitude;
    var imagename = req.body.ProfilePic;
    var Country = req.body.Country;
    var States = req.body.States;
    var City = req.body.City;
    
   
    /*
    if(req.files.ProfilePic != undefined)
    {
         var sampleFile;
         sampleFile = req.files.ProfilePic;
    	 var filename = req.files.ProfilePic.name;
    	 
    	 if(filename !="")
    	 {
    	   var imagename  = filename+Date.now()+path.extname(filename);
    	   
    	   sampleFile.mv(__dirname + '/../img/user/'+imagename, function(err)
    	   {
    	       if(err)
    	       {
    	           console.log(err);
    	       }
    	    });
    	    
    	 }
    	 
    }
    else
    	 {
    	     imagename = "";
    	 }
    */
    
    
    
    var data = {
        "Status":0,
        "Message":""
        };
        //console.log(req);
    if(!!first_name && !!last_name && !!email && !!password)
	{
		
		db.query("SELECT * from User WHERE Email=?",[email],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
                          		data["Message"] = "Email Already Register Please Try Other Email Address .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						     db.query("INSERT INTO User VALUES('',?,?,?,?,?,?,'','','','','','','',?,?,?,?,?,'','','',?,?,?)",[first_name,last_name,email,password,contact_no,imagename,user_type,device_id,device_type,Latitude,Longitude,Country,States,City],function(err, rows, fields)
												  {
													if(!!err)
													{
														data["Message"] = "Error Adding Data";
														res.json(data);
													}
													else
													{
														data["Status"] = 1;
														data["Message"] = "User Has Been Register Successfully";
														data["user_id"] = rows.insertId;
														data["Body"] = req.body;
														data["url"] = "https://brightdeveloper.work/server/img/";
														data["image"] = {"ProfilePic":imagename}
														res.json(data);
													}
													
												});		
						 }	
					  });
    }
	else
	{
        data["Message"] = "Please Provide All Required Data (i.e : name, email, password)";
        res.json(data);
    }    
        
        
        
  },
  
  Signupcontractor: function(req, res) {
    var id = req.params.id;
    var user = data[0]; // Spoof a DB call
    res.json(user);
  },
 
  Signuptechnician: function(req, res) {
    var newuser = req.body;
    data.push(newuser); // Spoof a DB call
    res.json(newuser);
  },
  
  createtoken: function(req , res) {
      var payload = { Service : 'Connection' };
      var secret = 'ServiceConnection APi Doc';
      var token = jwt.encode(payload, secret);
      res.json(newuser);
  }
};

 
module.exports = signup;
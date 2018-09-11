var db = require('./db');
var path = require('path');
var async = require("async");
var notify = require('push-notify');
var apn = require('apn');
var express = require('express');
var app = express();


var options = {
  token: {
    key: __dirname + '/../push/AuthKey_NAQY8A83XB.p8',
    keyId: "NAQY8A83XB",
    teamId: "E6MMJ8JFC4"
  },
  production: false
};
var apnProvider = new apn.Provider(options);



var services = {
    
    CreatePost : function(req,res)
    {
        var UserID = req.body.user_id;
        var Description = req.body.description;
        var Photos = req.body.photos;
        var DateTime = req.body.dateTime;
        var data = {"Status":0,"Message":""}; 
        if(!!UserID)
            {
                db.query("INSERT INTO Post VALUES('',?,?,?,?)",[UserID,Description,Photos,DateTime],function(err, rows, fields)
               {
                                 if(err)
                                 { 
                                        data["Message"] = "Error Adding Data .";
                                        res.json(data);			 
                                 }
                                 else
                                 {
                                   
                                    data["Status"] = 1;
                                    data["Message"] = "Post Has Been Created Successfully";
                                    data["InsertID"] = rows.insertId;
                                    data["Body"] = req.body;
                                    res.json(data);

                                 }

               });
            }
            else
            {
                 data["Message"] = "Please Provide All Required Data (i.e : UserID)";
                 res.json(data);
            }
        
        
        
    },
    GetPost : function(req,res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        if(!!UserID)
            {
                db.query("SELECT * from Post WHERE UserID = ? ",[UserID],function(err, rows, fields)
               {
                                 if(err)
                                 { 
                                        data["Message"] = "Sorry List Not Found.";
                                        res.json(data);			 
                                 }
                                 else
                                 {
                                   
                                   data["Status"] = 1;
                                   data["Message"] = rows;
                                   data["UserId"] = UserID;
                                   res.json(data);

                                 }

               });
            }
            else
            {
                 data["Message"] = "Please Provide All Required Data (i.e : UserID)";
                 res.json(data);
            }
        
        
    }
    ,
    DeleteServicesAndEstimation : function(req,res)
    {
        var JobID = req.body.JobID;
            var data = {
                "Status":0,
                "Message":""
            };
            
            if(!!JobID)
            {
                db.query("DELETE FROM Estimation WHERE ServicesID=?",[JobID],function(err, rows, fields){
                    if(!!err)
                    {
                        data["Message"] = "Error deleting data";
                    }
                    else
                    {
                        
                        db.query("DELETE FROM Services WHERE ID=?",[JobID],function(err, rows, fields){
                    
                        });
                        
                        data["Status"] = 1;
                        data["Message"] = "Services story Successfully";
                    }
                    res.json(data);
                });
            }
            else
            {
                data["Message"] = "Please provide all required data (i.e : JobID )";
                res.json(data);
            }
            
            
    }
    ,
    GetGroupnotmembers : function(req,res)
    {
         var GroupID = req.params.GroupID;
         var UserID = req.params.UserID;
         var data = {"Status":0,"Message":""};
        
                 if(!!GroupID)
                {
                    var q = db.query("SELECT * from UserGroup WHERE GroupID = ? ",[GroupID],function(error, result, fields)
                          {
                              //console.log(q.sql);
                            if(result.length > 0)
                             { 
                                 var MemberID = result[0].MemberID;
                                 var array = MemberID.split(',');
                                 
                                 //console.log(array);
                                 
                                 
                                 /*    SELECT  R.RequestID , R.UserOne , R.UserTwo , R.Status , U.Fname , U.Lname , U.Email , U.Id ,U.ProfilePic , U.ContactNo , U.CompanyName , U.Address , U.LicenceNo , U.LicenceImage , U.NoOfTechnicians , U.OtherCertificate , U.Skill , U.UserType , U.DeviceId , U.DeviceType , U.Latitude , U.Longitude ,U.Experience , U.services_provided , U.services_names from User U , Request R WHERE CASE WHEN R.UserOne = "+UserID+" THEN R.UserTwo = U.Id WHEN R.UserTwo = "+UserID+" THEN R.UserOne = U.Id END AND R.Status = '1'  */
                                 
                                 
                                  var q = db.query("SELECT U.Id , U.Fname ,U.Lname,U.Email,U.ContactNo,CONCAT('https://brightdeveloper.work/server/img/',U.ProfilePic) AS ProfilePic,U.CompanyName , U.ContactNo , U.Address , U.LicenceNo , U.LicenceImage , U.NoOfTechnicians , U.OtherCertificate , U.Skill , U.UserType , U.DeviceId , U.DeviceType , U.Latitude , U.Longitude ,U.Experience , U.services_provided , U.services_names from User U , Request R  WHERE CASE WHEN R.UserOne = "+UserID+" THEN R.UserTwo = U.Id WHEN R.UserTwo = "+UserID+" THEN R.UserOne = U.Id END AND R.Status = '1' AND  U.Id NOT IN("+array+")",[GroupID],function(error, rows, fields)
                                  {
                                      console.log(q.sql);
                                    if(rows.length > 0)
                                     { 
                                       
                                         data["Status"] = 1;
                                         data["Message"] = rows;
                                         data["AdminID"] = result[0].UserID;
                                         res.json(data);				 
                                     }
                                     else
                                     {
                                            data["Message"] = "Sorry Member Not Found .";
                                            res.json(data);

                                     }	

                                  });
                                 
                                 				 
                             }
                             else
                             {
                                    data["Message"] = "Sorry Group  Not Found .";
                                    res.json(data);

                             }	

                          });
                }
                else
                {
                     data["Message"] = "Please Provide All Required Data (i.e : GroupID )";
                     res.json(data);
                }
    },
    GetGroupmembers:function(req,res)
    {
       
        var GroupID = req.params.GroupID;
        var data = {"Status":0,"Message":""};
        
                 if(!!GroupID)
                {
                    var q = db.query("SELECT * from UserGroup WHERE GroupID = ? ",[GroupID],function(error, result, fields)
                          {
                              //console.log(q.sql);
                            if(result.length > 0)
                             { 
                                 var MemberID = result[0].MemberID;
                                 var array = MemberID.split(',');
                                 
                                 //console.log(array);
                                 
                                  var q = db.query("SELECT Id ,Fname ,Lname,Email,ContactNo,CONCAT('https://brightdeveloper.work/server/img/',ProfilePic) AS ProfilePic,CompanyName from User WHERE Id IN("+array+")",[GroupID],function(error, rows, fields)
                                  {
                                      console.log(q.sql);
                                    if(rows.length > 0)
                                     { 
                                       
                                         data["Status"] = 1;
                                         data["Message"] = rows;
                                         data["AdminID"] = result[0].UserID;
                                         res.json(data);				 
                                     }
                                     else
                                     {
                                            data["Message"] = "Sorry Member Not Found .";
                                            res.json(data);

                                     }	

                                  });
                                 
                                 				 
                             }
                             else
                             {
                                    data["Message"] = "Sorry Group  Not Found .";
                                    res.json(data);

                             }	

                          });
                }
                else
                {
                     data["Message"] = "Please Provide All Required Data (i.e : GroupID )";
                     res.json(data);
                }
            
    },
    ChatDetails:function(req,res)
    {
        var UserID = req.params.UserID;
        var FriendID = req.params.FriendID;
        var GroupID = req.params.GroupID;
        var data = {"Status":0,"Message":""};
        
            if(GroupID != 0)
            {
              
                 var q = db.query("SELECT ChatID ,UserID ,FriendID ,Message ,Image ,DATE_FORMAT(DateTime,'%y-%m-%d %H:%i:%s') AS DateTime,UserName,UserImage,ChatType,GroupID from Chat WHERE GroupID = ?",[GroupID],function(error, result, fields)
                          {

                            if(result.length > 0)
                             { 
                                 data["Status"] = 1;
                                 data["Message"] = result;
                                 data["UserId"] = UserID;
                                 res.json(data);				 
                             }
                             else
                             {
                                    data["Message"] = "Sorry Chat List Not Found .";
                                    res.json(data);

                             }	

                          });
                
            }
            else
            {
                 if(!!UserID && !!FriendID)
                {
                    var q = db.query("SELECT ChatID ,UserID ,FriendID ,Message ,Image ,DATE_FORMAT(DateTime,'%y-%m-%d %H:%i:%s') AS DateTime,UserName,UserImage,ChatType,GroupID  from Chat WHERE UserID = ? AND FriendID = ?  OR UserID = ? AND FriendID = ?",[UserID,FriendID,FriendID,UserID],function(error, result, fields)
                          {
                              console.log(q.sql);
                            if(result.length > 0)
                             { 
                                 data["Status"] = 1;
                                 data["Message"] = result;
                                 res.json(data);				 
                             }
                             else
                             {
                                    data["Message"] = "Sorry Chat List Not Found .";
                                    res.json(data);

                             }	

                          });
                }
                else
                {
                     data["Message"] = "Please Provide All Required Data (i.e :UserID )";
                     res.json(data);
                }
            }
       
    },
    ChatList : function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        if(!!UserID)
            {
                
                var q = db.query(" ( SELECT  ( SELECT ( CASE WHEN  UserID = "+UserID+" THEN FriendID WHEN FriendID = "+UserID+" THEN UserID  END )  AS Friend_ID  FROM `Chat` WHERE ChatID = C.ChatID) AS Friend_ID , ( SELECT CONCAT('https://brightdeveloper.work/server/img/',ProfilePic) FROM User WHERE Id = ( SELECT ( CASE WHEN  UserID = "+UserID+" THEN FriendID WHEN FriendID = "+UserID+" THEN UserID  END )  FROM `Chat` WHERE ChatID = C.ChatID  ) ) AS Friend_PIC , ( SELECT CASE WHEN  UserType = 'contractor' THEN CompanyName WHEN UserType != 'contractor' THEN CONCAT(Fname , Lname )  END  FROM User WHERE Id = ( SELECT ( CASE WHEN  UserID = "+UserID+" THEN FriendID WHEN FriendID = "+UserID+" THEN UserID  END )  FROM `Chat` WHERE ChatID = C.ChatID  ) ) AS Friend_NAME , ( SELECT message  FROM `Chat` WHERE ChatType = 'single' AND UserID = "+UserID+" And FriendID = Friend_ID OR UserID = Friend_ID  And FriendID = "+UserID+"  ORDER BY `ChatID`  DESC  LIMIT 1 ) AS Lastmessage ,( SELECT DATE_FORMAT(DateTime,'%y-%m-%d %H:%i:%s')  FROM `Chat` WHERE ChatType = 'single' AND  UserID = "+UserID+" And FriendID = Friend_ID OR UserID = Friend_ID  And FriendID = "+UserID+"  ORDER BY `ChatID`  DESC  LIMIT 1 ) AS DateTime ,  C.ChatID , C.UserID , C.FriendID , C.Message , C.Image , C.UserName , C.UserImage , C.ChatType , C.GroupID  FROM `Chat` C ,User U WHERE CASE WHEN C.UserID = "+UserID+" THEN C.FriendID = U.Id WHEN C.FriendID = "+UserID+" THEN C.UserID = U.Id END  AND ChatType = 'single'  GROUP BY U.Id  ORDER BY C.ChatID DESC ) UNION ( SELECT (SELECT MemberID FROM `UserGroup` WHERE GroupID = C.GroupID ) AS  Friend_ID , ( SELECT CONCAT('https://brightdeveloper.work/server/img/',GroupImage) FROM `UserGroup` WHERE GroupID = ( SELECT GroupID FROM  Chat WHERE ChatID = C.ChatID  )  )  AS Friend_PIC , ( SELECT GroupName FROM `UserGroup` WHERE GroupID = ( SELECT GroupID FROM  Chat WHERE ChatID = C.ChatID  ) )  AS Friend_NAME ,  ( SELECT message  FROM `Chat` WHERE GroupID = C.GroupID  AND ChatType = 'groupChat' ORDER BY `ChatID`  DESC  LIMIT 1 ) AS Lastmessage , ( SELECT DATE_FORMAT(DateTime,'%y-%m-%d %H:%i:%s')  FROM `Chat` WHERE GroupID = C.GroupID AND ChatType = 'groupChat'  ORDER BY `ChatID`  DESC  LIMIT 1 ) AS DateTime , C.ChatID , C.UserID , C.FriendID , C.Message , C.Image , C.UserName , C.UserImage , C.ChatType , C.GroupID   FROM `Chat` C WHERE GroupID IN(SELECT GroupID FROM `UserGroup` WHERE UserID = "+UserID+" OR FIND_IN_SET("+UserID+",MemberID) ) AND ChatType = 'groupChat' GROUP BY GroupID ORDER BY C.ChatID DESC )",[UserID,UserID,UserID,UserID],function(error, result, fields)
			          {
                        if(error)
                        {
                          console.log(error);  
                        }
                        console.log(q.sql);
						if(result.length > 0)
			             { 
			                 data["Status"] = 1;
							 data["Message"] = result;
                             
							 res.json(data);				 
						 }
						 else
						 {
						        data["Message"] = "Sorry Chat List Not Found .";
							    res.json(data);
						    	
						 }	
                    
					  });
            }
            else
            {
                 data["Message"] = "Please Provide All Required Data (i.e :UserID )";
                 res.json(data);
            }
        
    },
    AddAndDeleteMember : function(req,res)
    {
            var members_id = req.body.members_id;
            var group_id = req.body.group_id;
            var remove_members_id = req.body.remove_members_id;
            var data = {"Status":0,"Message":""};
            if(!!members_id && !!group_id)
            {
                db.query("UPDATE UserGroup SET MemberID=? WHERE GroupID=?",[members_id,group_id],function(err, rows, fields)
               {
                               if(err)
                                 { 
                                        data["Message"] = "Error Adding Data .";
                                        res.json(data);			 
                                 }
                                 else
                                 {
                                     
                                     var q= db.query("SELECT * FROM User WHERE Id =?",[remove_members_id],function(err, rows, fields)
                                     {
                                   // console.log(q.sql);
                                   
                                    async.each(rows, function (row, callback) 
                                        {
                                        
                                         var q= db.query("SELECT * FROM UserGroup WHERE GroupID =?",[group_id],function(err, rowss, fields)
                                         {

                                              var groupname = rowss[0].GroupName;
                                              
                                             
                                                    let deviceToken = row.DeviceId;
                                                    var note = new apn.Notification();
                                                    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                    note.badge = 0;
                                                    note.sound = "default";
                                                    note.alert =  {"title": "Group Admin Remove Yor From  "+groupname, "body": ""} ;
                                                    //note.payload = {'messageFrom': 'John Appleseed'};
                                                    note.topic = "com.ServiceConnection";
                                                    note.rawPayload = {
                                                          from: "node-apn",
                                                          source: "web",
                                                          aps: {
                                                              "notification_type" : "AddAndDeleteMember",
                                                              "badge" : 0,
                                                              "sound": "default",
                                                              "alert": {"title": "Group Admin Remove Yor From  " + groupname, "body": ""},
                                                              "content-available": 1,
                                                              "remove_members_id":remove_members_id
                                                          }
                                                        }; 


                                                    apnProvider.send(note, deviceToken).then( (result) => {
                                                      // see documentation for an explanation of result

                                                      console.log(result);
                                                      console.log(result.response);

                                                    });
                                            

                                         });
                                        
                                        
                                               
                                        });
                                    
                                    
                                 });

                                    data["Status"] = 1;
                                    data["Message"] = "Group Has Been Updated Successfully";
                                    data["Body"] = req.body;
                                    res.json(data);

                                 }

               });
            }
            else
            {
                 data["Message"] = "Please Provide All Required Data (i.e :group_id , members_id)";
                 res.json(data);
            }
    },
    CreateGroup:function(req , res)
    {
            var user_id = req.body.user_id;
            var members_id = req.body.members_id;
            var group_name = req.body.group_name;
            var group_image = req.body.group_image;
            var message = " New Group Created ";
            var date = req.body.datetime;
            var ChatType = "groupChat"; 
            var data = {"Status":0,"Message":""};
            if(!!user_id && !!members_id && !!group_name)
            {
                db.query("INSERT INTO UserGroup VALUES('',?,?,?,?)",[user_id,members_id,group_name,group_image],function(err, rows, fields)
               {
                                 if(err)
                                 { 
                                        data["Message"] = "Error Adding Data .";
                                        res.json(data);			 
                                 }
                                 else
                                 {
                                    var GroupID = rows.insertId 
                                  db.query("INSERT INTO Chat VALUES('',?,?,?,'',?,?,?,?,?)",[user_id,members_id,message,date,group_name,group_image,ChatType,GroupID],function(err, rows, fields)
                                     {
        
                                    });

                                    data["Status"] = 1;
                                    data["Message"] = "Group Has Been Created Successfully";
                                    data["InsertID"] = rows.insertId;
                                    data["Body"] = req.body;
                                    res.json(data);

                                 }

               });
            }
            else
            {
                 data["Message"] = "Please Provide All Required Data (i.e : user_id , members_id , group_name)";
                 res.json(data);
            }
            
    },
    TestNotifi : function(req , res)
    {
           let deviceToken = "E0406C2F60350AF84938DD4D5D341815547649BD19DA3A51D66A6E5929319CBE";
    
            var note = new apn.Notification();

            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 0;
            note.sound = "default";
            note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
            //note.payload = {'messageFrom': 'John Appleseed'};
            note.topic = "com.ServiceConnection";


            apnProvider.send(note, deviceToken).then( (result) => {
              // see documentation for an explanation of result

              console.log(result);
              console.log(result.response);

            });
            res.send(" done !!! ");
    },
    GetNearByUsers : function(req , res)
    {
        //(((acos(sin(( "+lat+" *pi()/180)) *  sin(( u.Latitude * pi()/180))+cos(( "+lat+" * pi()/180)) *  cos(( u.Latitude * pi()/180)) * cos((("+lng+" - u.Longitude)*  pi()/180))))*180/pi())*60*1.1515 ) as distance
        
            var lat = req.body.lat;
            var lng = req.body.lng;
            var user_id = req.body.user_id;
            var data = {"Status":0,"Message":""};
            var q = db.query("SELECT (((acos(sin(( "+lat+" *pi()/180)) *  sin(( Latitude * pi()/180))+cos(( "+lat+" * pi()/180)) *  cos(( Latitude * pi()/180)) * cos((("+lng+" - Longitude)*  pi()/180))))*180/pi())*60*1.1515 ) as distance , (SELECT Status FROM Request WHERE UserTwo = Id AND UserOne = "+user_id+" LIMIT 1) as Friendrequest , Fname , Lname , Email , Id ,ProfilePic , ContactNo , CompanyName , Address , LicenceNo , LicenceImage , NoOfTechnicians , OtherCertificate , Skill , UserType , DeviceId , DeviceType , Latitude , Longitude ,Experience , services_provided , services_names  from User WHERE Id Not IN (SELECT CASE WHEN UserOne = "+user_id+" THEN UserTwo WHEN UserTwo = "+user_id+" THEN UserOne END FROM `Request` WHERE Status = 1 AND (UserOne = "+user_id+" OR UserTwo = "+user_id+") ) AND Id != ? AND  UserType IN('Technician','contractor')  HAVING distance <= 50",[user_id],function(error, result, fields)
			          {
			             console.log(q.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
                             data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    }
    ,
    GetInvoiceDetail : function(req ,res)
    {
        var UserID = req.params.user_id;
        var JobID = req.params.job_id;
        var data = {"Status":0,"Message":""};
        var q = db.query("SELECT * from Invoice WHERE UserID=? AND JobID=?",[UserID,JobID],function(error, result, fields)
			          {
			             //console.log(q.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    }
    ,
    CreateInvoice : function(req , res)
    {
         var UserID = req.body.user_id;
         var JobId = req.body.job_id;
         var Amount = req.body.amount;
         var data = {"Status":0,"Message":""};
         db.query("INSERT INTO Invoice VALUES('',?,?,?)",[UserID,JobId,Amount],function(err, rows, fields)
	       {
                
             
                           if(err)
    			             { 
                              		data["Message"] = "Error Adding Data .";
    							    res.json(data);			 
    						 }
    						 else
    						 {
    						     
    						    data["Status"] = 1;
    							data["Message"] = "Invoice Has Been Added Successfully";
    							data["InsertID"] = rows.insertId;
    							data["Body"] = req.body;
    							res.json(data);
    						    	
    						 }
             
	       });
    }
    ,
    GetUserEstimation: function(req,res)
    {
        
        
        var UserID = req.params.UserID;
        
        var data = {"Status":0,"Message":""};
        
        
        var q = db.query("SELECT * from EstimationSetting WHERE UserID=?",[UserID],function(error, result, fields)
			          {
			             console.log(q.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
        
        
    },
    SaveEstimation : function(req , res)
    {
         var UserID = req.body.UserID;
         var PricePerHour = req.body.PricePerHour;
         var TravelCharges = req.body.TravelCharges;
         var TruckCharges = req.body.TruckCharges;
         var ETA = req.body.ETA;
         var DiagnosticCharges = req.body.DiagnosticCharges;
        
         var data = {"Status":0,"Message":""};
         
         db.query("INSERT INTO EstimationSetting VALUES('',?,?,?,?,?,?)",[UserID,PricePerHour,TravelCharges,TruckCharges,ETA,DiagnosticCharges],function(err, rows, fields)
	       {
                
             
                           if(err)
    			             { 
                              		data["Message"] = "Error Adding Data .";
    							    res.json(data);			 
    						 }
    						 else
    						 {
    						     
    						    data["Status"] = 1;
    							data["Message"] = "Estimation Has Been Added Successfully";
    							data["InsertID"] = rows.insertId;
    							data["Body"] = req.body;
    							res.json(data);
    						    	
    						 }
             
	       });
	       
	     
    },
    GetQuoteDetails : function(req,res)
    {
        var JobId = req.params.JobId;
        var data = {"Status":0,"Message":""};
        var q = db.query("SELECT * from Estimation WHERE ServicesID=?",[JobId],function(error, result, fields)
			          {
			             console.log(q.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    },
    
    GetUserDetails: function(req,res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        var query = db.query("SELECT * from User  WHERE Id = ?  ",[UserID],function(error, result, fields)
			          {
			              //console.log(query.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    },
    GetJobDetails : function (req , res)
    {
        var JobID = req.body.JobID;
        //var user_id = req.body.user_id;
         var data = {"Status":0,"Message":""};
        db.query("SELECT (SELECT TechnicianID FROM ServicesFunction WHERE ServicesID = s.ID LIMIT 1) as TechnicianID , (SELECT ContractorID FROM ServicesFunction WHERE ServicesID = s.ID LIMIT 1) as ContractorID , (SELECT Status FROM ServicesFunction WHERE ServicesID = s.ID LIMIT 1) as Workingstatus , (SELECT status FROM Estimation WHERE AcceptedBy = s.USERID AND ServicesID = s.ID LIMIT 1) as EstimationStatus  , s.ID ,s.USERID , s.ADDRESS , s.LAT , s.LNG , s.URGENCY , s.PROBLEM , s.DESCRIPTION , s.SERVICEID , s.SERVICENAME from Services s WHERE  ID = ?",[JobID],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
                             data["Status"] = 1;
							 data["Message"] = result;
							 //data["TechnicianDetails"] = Getuser_Details(user_id);
							 res.json(data);
							 return;
                          					 
						 }
						 else
						 {
							    res.json(data);
							    return;
						    	
						 }	
					  });
    }
    ,
    GetTechnicianJob : function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        var query = db.query("SELECT (SELECT Fname FROM User WHERE Id = S.USERID LIMIT 1) as Fname ,(SELECT Lname FROM User WHERE Id = S.USERID LIMIT 1) as Lname ,  (SELECT ProfilePic FROM User WHERE Id = S.USERID LIMIT 1) as ProfilePic , S.ADDRESS  , S.DESCRIPTION , S.ID , S.LAT ,S.LNG ,S.PROBLEM ,S.SERVICEID ,S.SERVICENAME,S.USERID , S.URGENCY ,  SF.ServicesID, SF.Status as Workingstatus , SF.TechnicianID ,  SF.ContractorID ,SF.ID AS SFID  from ServicesFunction AS SF JOIN Services AS S ON S.ID = SF.ServicesID WHERE  SF.TechnicianID = ?  ",[UserID],function(error, result, fields)
			          {
			              console.log(query.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
        
    }
    ,
    Getuser_Details : function(userId)
    {
        var data = {"Message":""};
        db.query("SELECT * from User WHERE  ID = ?",[userId],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
							 data["Message"] = result;
							 res.json(data);
							 return;
                          					 
						 }
						 else
						 {
							    res.json(data);
							    return;
						    	
						 }	
					  });
    },
    AcceptJobByTechnician : function(req , res)
    {
         var requested_id = req.body.requested_id;
         var job_id = req.body.job_id;
         var Status = req.body.Status;
         var data = {"Status":0,"Message":""};
         
         
         db.query("SELECT * FROM Services WHERE ID = ?",[job_id],function(error, result, fields)
        {
            if(result.length > 0)
            {
                   db.query("UPDATE ServicesFunction SET Status=? WHERE ID=?",[Status,requested_id],function(err, rows, fields)
	       {
             
             
            
                           /*    notification  Code  */
                                        db.query("SELECT (SELECT CONCAT(Fname , Lname) AS Username FROM User WHERE Id = SF.TechnicianID  LIMIT 1) as Username , DeviceId , DeviceType FROM ServicesFunction  AS SF JOIN User AS U ON U.Id = SF.ContractorID WHERE  SF.ID = ?",[requested_id],function(err, rows_new, fields)
                                            {

                                                    if(Status == 1)
                                                     {
                                                          var msg = " has been accepted request that you assigned to him ";
                                                     }
                                                     else if(Status == 2)
                                                     {
                                                         var msg = " has been rejected your assigned request ";

                                                     }
                                                     else if(Status == 3)
                                                     {
                                                         var msg = " is arrived at location  ";

                                                     }
                                                     else if(Status == 4)
                                                     {

                                                         var msg = " Done The Task " ;
                                                     }
                                                    else
                                                    {
                                                          var msg = "  ";
                                                    }
                                            
                                            
                                            if(Status == 0)
                                                 {
                                                   var Statusmsg = "requested";  
                                                 }
                                            else if(Status == 1)
                                                {
                                                    var Statusmsg = "accepted";  
                                                }
                                            else if(Status == 2)
                                                {
                                                    var Statusmsg = "rejected";  
                                                }
                                            else if(Status == 3)
                                                {
                                                    var Statusmsg = "Working";  
                                                }
                                            else
                                                {
                                                   var Statusmsg = "Done";   
                                                }

                                                
                                                 
                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = rows_new[0].Username + msg ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : Statusmsg,
                                                          "job_id":job_id,
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : rows_new[0].Username + msg ,
                                                          "content-available": 1
                                                      }
                                                    }; 
  

                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
             
            
                                     db.query("SELECT (SELECT CONCAT(Fname , Lname) AS Username FROM User WHERE Id = SF.TechnicianID  LIMIT 1) as Username , DeviceId , DeviceType FROM ServicesFunction  AS SF JOIN User AS U ON U.Id = (SELECT S.USERID FROM ServicesFunction AS SFF JOIN Services AS S ON S.ID = SFF.ServicesID WHERE SFF.ID = ?) WHERE  SF.ID = ?",[requested_id,requested_id],function(err, rows_new, fields)
                                            {
                                                    if(Status == 1)
                                                     {
                                                          var msg = " has been accepted request that you assigned to him ";
                                                     }
                                                     else if(Status == 2)
                                                     {
                                                         var msg = " has been rejected your assigned request ";

                                                     }
                                                     else if(Status == 3)
                                                     {
                                                         var msg = " is arrived at location  ";

                                                     }
                                                     else if(Status == 4)
                                                     {

                                                         var msg = " Done The Task ";
                                                     }
                                                    else
                                                    {
                                                          var msg = "  ";
                                                    }
                                                    
                                                     if(Status == 0)
                                                 {
                                                   var Statusmsg = "requested";  
                                                 }
                                            else if(Status == 1)
                                                {
                                                    var Statusmsg = "accepted";  
                                                }
                                            else if(Status == 2)
                                                {
                                                    var Statusmsg = "rejected";  
                                                }
                                            else if(Status == 3)
                                                {
                                                    var Statusmsg = "Working";  
                                                }
                                            else
                                                {
                                                   var Statusmsg = "Done";   
                                                }
                                                
                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = rows_new[0].Username + msg ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                 note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : Statusmsg,
                                                          "job_id":job_id,
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : rows_new[0].Username + msg ,
                                                          "content-available": 1
                                                      }
                                                    };


                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                           
                        /*    Notification Code  */ 
	       });
	       
	        data["Status"] = 1;
	        data["Message"] = "Job Has Been Accepted Successfully";
	         res.json(data); 
            }
            else
            {
                data["Message"] = "This service has been removed by user";
	            res.json(data); 
            }
        });
         
         
	       
	    
    },
    
    AssignJob : function(req , res)
    {
         var user_id = req.body.user_id;
         var job_id = req.body.job_id;
         var technician_id = req.body.technician_id;
         var Status = req.body.Status;
         var data = {"Status":0,"Message":""};
         
          db.query("SELECT * FROM Services WHERE ID =?",[job_id],function(error, results, fields)
         {
             
                 
             
             
            if(results.length > 0)
            { 
                
                
                db.query("INSERT INTO ServicesFunction VALUES('',?,?,?,?)",[job_id,user_id,technician_id,Status],function(error, result, fields)
    			          {
    						if(error)
    			             { 
                              		data["Message"] = "Error Adding Data .";
    							    res.json(data);			 
    						 }
    						 else
    						 {
    						     
                                
                                 
                                /*    notification  Code  */
                                        db.query("SELECT (SELECT CONCAT(Fname , Lname) AS Username FROM User WHERE ID =?  LIMIT 1) as Username , DeviceId , DeviceType FROM User WHERE ID = ?",[user_id , technician_id],function(err, rows_new, fields)
                                            {
                                            
                                             if(Status == 0)
                                                 {
                                                   var Statusmsg = "requested";  
                                                 }
                                            else if(Status == 1)
                                                {
                                                    var Statusmsg = "accepted";  
                                                }
                                            else if(Status == 2)
                                                {
                                                    var Statusmsg = "rejected";  
                                                }
                                            else if(Status == 3)
                                                {
                                                    var Statusmsg = "Working";  
                                                }
                                            else
                                                {
                                                   var Statusmsg = "Done";   
                                                }

                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = "New service request is assigned to you" ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : Statusmsg,
                                                          "job_id":job_id,
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : "New service request is assigned to you" ,
                                                          "content-available": 1
                                                      }
                                                    }; 


                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                             
                                             
                                         var q =     db.query("SELECT DeviceId , DeviceType FROM User AS U JOIN Services AS S ON S.USERID = U.Id WHERE S.ID = ?",[job_id],function(err, rows_new, fields)
                                            {
                                                
                                            console.log(q.sql);
                                             if(Status == 0)
                                                 {
                                                   var Statusmsg = "requested";  
                                                 }
                                            else if(Status == 1)
                                                {
                                                    var Statusmsg = "accepted";  
                                                }
                                            else if(Status == 2)
                                                {
                                                    var Statusmsg = "rejected";  
                                                }
                                            else if(Status == 3)
                                                {
                                                    var Statusmsg = "Working";  
                                                }
                                            else
                                                {
                                                   var Statusmsg = "Done";   
                                                }

                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = "Your service is assign to technician successfully" ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : Statusmsg,
                                                          "job_id":job_id,
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : "Your service is assign to technician successfully" ,
                                                          "content-available": 1
                                                      }
                                                    }; 


                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                             
                                             
                                          /*    Notification Code  */ 
                                 
                                 
                                 
    						    data["Status"] = 1;
    							data["Message"] = "Job Has Been Assigned Successfully";
    							data["InsertID"] = result.insertId;
    							data["Body"] = req.body;
    							res.json(data);
    						    	
    						 }	
    					  });
                
                
            }
            else
            {
                data["Message"] = "This service has been removed by user";
	            res.json(data); 
            }
        });
         
         
         
         
    },
    AcceptTechnicianRequest : function(req , res)
    {
        var RequestedId = req.body.RequestedId
        var Status = req.body.Status
        var data = {"Status":0,"Message":""};
        
        db.query("UPDATE TechRelationWithContr SET Status=? WHERE ID=?",[Status,RequestedId],function(err, rows, fields)
	       {
   
            
                    /*    notification  Code  */
            var q = db.query("SELECT (SELECT CONCAT(Fname , Lname) AS Username FROM User WHERE ID = TRW.TechnicianID  LIMIT 1) as Username , U.DeviceId , U.DeviceType FROM TechRelationWithContr AS TRW JOIN User AS U ON U.Id = TRW.ContractorID WHERE  TRW.ID = ?",[RequestedId],function(err, rows_new, fields)
                                            {
                                                console.log(q.sql);
                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = "Your request has been confirmed by "+ rows_new[0].Username ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : "TechconfirmRequest",
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : "Your request has been confirmed by "+ rows_new[0].Username ,
                                                          "content-available": 1
                                                      }
                                                    };  


                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                          /*    Notification Code  */ 
            
            
            
	       });
	       
	     data["Status"] = 1;
	     data["Message"] = "Data Has Been Updated Successfully";
	    res.json(data);    
    }
    ,
    GetTechnician : function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        db.query("SELECT * from TechRelationWithContr JOIN User ON User.ID = TechRelationWithContr.TechnicianID WHERE  ContractorID = ? AND Status = 1 ",[UserID],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
        
    }
    ,
    GetContractorsrequests : function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        db.query("SELECT * from TechRelationWithContr JOIN User ON User.ID = TechRelationWithContr.ContractorID WHERE  TechnicianID = ? AND Status = 0 ",[UserID],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    }
    ,
    AddTechnician : function(req , res)
    {
        
        var ContractorID = req.body.contractor_id;
        var TechnicianID = req.body.technician_id;
        
        var data = {"Status":0,"Message":""}; 
        
        db.query("SELECT *  FROM TechRelationWithContr WHERE TechnicianID = ? AND ContractorID = ?",[TechnicianID,ContractorID],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
			                 
			                 data["Message"] = "Technician Already Added .";
							 res.json(data);
			                
                          					 
						 }
						 else
						 {
						     
						        db.query("INSERT INTO TechRelationWithContr VALUES('',?,?,'')",[TechnicianID,ContractorID],function(error, result, fields)
            			          {
            						if(error)
            			             { 
                                         
                                      		data["Message"] = "Error Adding Data .";
            							    res.json(data);			 
            						 }
            						 else
            						 {
                                         
                                         /*    notification  Code  */
                                        db.query("SELECT CompanyName AS Username FROM User WHERE ID =?  LIMIT 1) as Username , DeviceId , DeviceType FROM User WHERE ID = ?",[ContractorID , TechnicianID],function(err, rows_new, fields)
                                            {

                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = rows_new[0].Username + "Send You Request " ;
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : 'AddTechnicianRequest',
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : rows_new[0].Username + "Send You Request " ,
                                                          "content-available": 1
                                                      }
                                                    }; 

                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                          /*    Notification Code  */
            						     
            						    data["Status"] = 1;
            							data["Message"] = "Estimation Has Been Created Successfully";
            							data["InsertId"] = result.insertId;
            							data["Body"] = req.body;
            							res.json(data);
            						    	
            						 }	
            					  });
						    	
						 }	
					  });
        
        
        
    },
    
    GetAllTechnicians : function(req , res)
    {  
        var UserId = req.body.UserId;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var data = {"Status":0,"Message":""}; 
       var query =  db.query("SELECT (SELECT Status FROM TechRelationWithContr WHERE TechnicianID = u.Id AND ContractorID = ? LIMIT 1) as RequestStatus , (((acos(sin(( "+lat+" *pi()/180)) *  sin(( u.Latitude * pi()/180))+cos(( "+lat+" * pi()/180)) *  cos(( u.Latitude * pi()/180)) * cos((("+lng+" - u.Longitude)*  pi()/180))))*180/pi())*60*1.1515 ) as distance ,Id , Fname, Lname , Email , ContactNo , ProfilePic , CompanyName , Address , Skill , LicenceNo , LicenceImage  FROM User as u WHERE Id != ?  AND UserType = 'Technician' HAVING distance <= 50",[UserId,UserId],function(error, result, fields)
			          {
			              console.log(query.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
        
    },
    
    GetRequests : function(req , res)
    {
        var user_id = req.body.user_id;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var services_ID = req.body.services_ID;
        
        //console.log(services_ID.split(','))
        
        var data = {"Status":0,"Message":""}; 
        db.query("SELECT (SELECT Fname FROM User WHERE Id = s.USERID LIMIT 1) as Fname ,(SELECT Lname FROM User WHERE Id = s.USERID LIMIT 1) as Lname ,  (SELECT ProfilePic FROM User WHERE Id = s.USERID LIMIT 1) as ProfilePic , (SELECT TechnicianID FROM ServicesFunction WHERE ServicesID = s.ID LIMIT 1) as TechnicianID , (SELECT Status FROM ServicesFunction WHERE ServicesID = s.ID LIMIT 1) as Workingstatus , (SELECT status FROM Estimation WHERE UserID = "+user_id+" AND ServicesID = s.ID LIMIT 1) as EstimationStatus , (((acos(sin(( "+lat+" *pi()/180)) *  sin(( s.LAT * pi()/180))+cos(( "+lat+" * pi()/180)) *  cos(( s.LAT * pi()/180)) * cos((("+lng+" - s.LNG)*  pi()/180))))*180/pi())*60*1.1515 ) as distance ,ID,USERID,ADDRESS,LAT,LNG,URGENCY,PROBLEM,DESCRIPTION,SERVICEID,SERVICENAME  FROM Services as s WHERE SERVICEID IN("+services_ID.split(',')+")  HAVING distance <= 50",function(error, result, fields)
			          {
			              if(error)
			              {
			                  console.log(error);
			              }
			              
						if(result.length > 0)
			             { 
			                 
			                 var alldata = [];
                           
                                
			                     async.each(result, function (row, callback) 
                                 {
    				                        var test = {};
    				                        test["EstimationStatus"] = row.EstimationStatus;
                        					test["distance"] = row.distance;
                        					test["ID"] = row.ID;
                        					test["USERID"] = row.USERID;
                        					test["ADDRESS"] = row.ADDRESS;
                        					test["LAT"] = row.LAT;
                        					test["LNG"] = row.LNG;
                                            test["URGENCY"] = row.URGENCY;
        	                                test["PROBLEM"] = row.PROBLEM;
        	                                test["DESCRIPTION"] = row.DESCRIPTION;
        	                                test["SERVICEID"] = row.SERVICEID;
        	                                test["SERVICENAME"] = row.SERVICENAME;
        	                                test["Workingstatus"] = row.Workingstatus;
        	                                test["TechnicianID"] = row.TechnicianID;
        	                                test["Fname"] = row.Fname;
        	                                test["Lname"] = row.Lname;
        	                                test["ProfilePic"] = row.ProfilePic;
    		                                alldata.push(test);
    		                    });
			                   
			                
			                     data["Status"] = 1;
							     data["Message"] = alldata;
							     data["url"] = "https://brightdeveloper.work/server/img/";
							     res.json(data);
			                     
			                 
			                 
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  }); 
    },
    
   /* Workingstatus : function(ID)
    {
        var query =   db.query("SELECT * from ServicesFunction JOIN User ON User.ID = ServicesFunction.TechnicianID WHERE  ServicesID = ?",[ID],function(error, result, fields)
			          {
					       //console.log(result);	 
						   return result;
						  	
					  });
    },*/
    GetQuotes: function(req , res)
    {
        var JobID = req.params.JobID;
        var data = {"Status":0,"Message":""};   
        var Q = db.query("SELECT (SELECT ID FROM ServicesFunction WHERE ServicesID = E.ServicesID AND ContractorID = E.UserID  LIMIT 1) as requested_id , (SELECT Status FROM ServicesFunction WHERE ServicesID = E.ServicesID AND ContractorID = E.UserID  LIMIT 1) as Workingstatus ,(SELECT TechnicianID FROM ServicesFunction WHERE ServicesID = E.ServicesID AND ContractorID = E.UserID  LIMIT 1) as TechnicianID , E.AcceptedBy ,E.UserID , E.CreatedBy , E.DiagnosticCharges , E.ETA , E.PricePerHour , E.ServicesID , E.TravelCharges , E.Status , E.TruckCharges  , E.ID ,U.Address , U.CompanyName , U.ContactNo  , U.DeviceId , U.DeviceType , U.Email , U.Experience , U.Fname  , U.Id , U.Latitude , U.LicenceImage , U.LicenceNo , U.Lname , U.Longitude , U.NoOfTechnicians , U.OtherCertificate  , U.ProfilePic  , U.Skill , U.UserType  FROM Estimation AS E JOIN User AS U  ON U.ID = E.UserID WHERE  E.ServicesID = ?",[JobID],function(error, result, fields)
			          {
                        console.log(Q.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    },
   ApproveQuote : function(req , res)
   {
        var user_id = req.body.user_id;
        var Status = req.body.Status;
        var quote_id = req.body.quote_id;
        var job_id = req.body.job_id;
        var data = {"Status":0,"Message":""};
        if(!!user_id && !!Status && !!quote_id)
        {
            
            db.query("UPDATE Estimation SET Status=? , AcceptedBy=? WHERE ID=?",[Status,user_id,quote_id],function(err, rows, fields)
	       {
                
	       
             if(err)
             {
                 console.log(err);
             }
             else
             {
                 /*    notification  Code  */
                         db.query("SELECT (SELECT CONCAT(Fname , Lname) AS Username FROM User WHERE ID =?  LIMIT 1) as Username , U.DeviceId , U.DeviceType FROM Estimation AS E JOIN User AS U  ON U.ID = E.UserID WHERE  E.ID = ?",[user_id , quote_id],function(err, rows_new, fields)
                        {

                            let deviceToken = rows_new[0].DeviceId;
    
                            var note = new apn.Notification();
                            
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 0;
                            note.sound = "default";
                            note.alert = "Your Quote Is Approved By " + rows_new[0].Username;
                            //note.payload = {'notification_type': 'approveQuote' , 'job_id':job_id};
                            //note.body = job_id;
                             
                            note.rawPayload = {
                                  from: "node-apn",
                                  source: "web",
                                  aps: {
                                      "notification_type" : 'approveQuote',
                                      "job_id" : job_id,
                                      "badge" : 0,
                                      "sound": "default",
                                      "alert" : "Your Quote Is Approved By " + rows_new[0].Username,
                                      "content-available": 1
                                  }
                                }; 
                            note.topic = "com.ServiceConnection";


                            apnProvider.send(note, deviceToken).then( (result) => {
                              // see documentation for an explanation of result

                              console.log(result);
                              console.log(result.response);

                            });
                           
                             //your quote is approved by user name
                             
                         });
                 /*    Notification Code  */
             }
	       });
	       
    	     data["Status"] = 1;
    	     data["Message"] = "Quote Has Been Updated Successfully";
    	     res.json(data); 
            
            
            
        }
        else
    	{
            data["Message"] = "Please Provide All Required Data (i.e : user_id , quote_id)";
            res.json(data);
        } 
   },
   
   CreateEstimation: function(req , res)
   {
        var user_id = req.body.user_id;
        var job_id = req.body.job_id;
        var price_perHour = req.body.price_perHour;
        var travel_charges = req.body.travel_charges;
        var truck_charges = req.body.truck_charges;
        var ETA = req.body.ETA;
        var Status = req.body.Status;
         var diagnostic_charges = req.body.diagnostic_charges;
        
        var createby = "Cotractor";
        
        var data = {"Status":0,"Message":""};
       // console.log(req);
        if(!!user_id && !!job_id)
    	{
    		
    		db.query("SELECT * from Estimation  WHERE  ServicesID = ? AND UserID=?",[job_id,user_id],function(error, result, fields)
			          {
						if(result.length > 0)
			             { 
			                 
			                 data["Message"] = "Sorry Estimation Already Created .";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						     db.query("INSERT INTO Estimation VALUES('',?,?,?,?,?,?,?,?,?,'')",[user_id,job_id,price_perHour,travel_charges,truck_charges,ETA,Status,createby,diagnostic_charges],function(error, result, fields)
        			          {
        						if(error)
        			             { 
                                  		data["Message"] = "Error Adding Data .";
        							    res.json(data);			 
        						 }
        						 else
        						 {
                                     
                                     db.query("INSERT INTO WorkingStatus VALUES('',?,'','',?,?)",[user_id,job_id,0],function(error, result, fields)
                                      {
                                        
                                      });
                                     
                                     
                                     
                                     /*    notification  Code  */
                                     
                                     
                                         
                                             db.query("SELECT DeviceId , DeviceType FROM Services AS S JOIN User AS U  ON U.ID = S.USERID WHERE  S.ID = ?",[job_id],function(err, rows_new, fields)
                                            {

                                                let deviceToken = rows_new[0].DeviceId;

                                                var note = new apn.Notification();

                                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                                note.badge = 0;
                                                note.sound = "default";
                                                note.alert = "New Quote Recieved On Your Request";
                                                //note.payload = {'messageFrom': 'John Appleseed'};
                                                note.topic = "com.ServiceConnection";
                                                note.rawPayload = {
                                                      from: "node-apn",
                                                      source: "web",
                                                      aps: {
                                                          "notification_type" : "estimation",
                                                          "job_id" : job_id,
                                                          "badge" : 0,
                                                          "sound": "default",
                                                          "alert" : "New Quote Recieved On Your Request" ,
                                                          "content-available": 1
                                                      }
                                                    };  


                                                apnProvider.send(note, deviceToken).then( (result) => {
                                                  // see documentation for an explanation of result

                                                  console.log(result);
                                                  console.log(result.response);

                                                });

                                                 //your quote is approved by user name

                                             });
                                     /*    Notification Code  */
                                     
                                     
                                     
        						     
        						    data["Status"] = 1;
        							data["Message"] = "Estimation Has Been Created Successfully";
        							data["Estimationid"] = result.insertId;
        							data["Body"] = req.body;
        							res.json(data);
        						    	
        						 }	
        					  });
						        
						    	
						 }	
					  });
    		
    		
        }
    	else
    	{
            data["Message"] = "Please Provide All Required Data (i.e : user_id , job_id)";
            res.json(data);
        }  
        
   },
   
   CreateRequest: function(req , res) {
      
    var user_id = req.body.user_id;
    var service_address = req.body.service_address;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var urgency = req.body.urgency;
    var problem = req.body.problem;
    var description = req.body.description;
    var serviceId = req.body.service_id;
    var servicename = req.body.service_name;
    
   
    var data = {"Status":0,"Message":""};
       // console.log(req);
    if(!!user_id )
	{
		
		db.query("INSERT INTO Services VALUES('',?,?,?,?,?,?,?,?,?)",[user_id,service_address,lat,lng,urgency,problem,description,serviceId,servicename],function(error, result, fields)
			          {
						if(error)
			             { 
                          		data["Message"] = "Error Adding Data .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						    data["Status"] = 1;
							data["Message"] = "Services Has Been Created Successfully";
							data["Requestid"] = result.insertId;
							data["Body"] = req.body;
							res.json(data);
						    	
						 }	
					  });
    }
	else
	{
        data["Message"] = "Please Provide All Required Data (i.e : user_id,)";
        res.json(data);
    }    
       
  },
  
  Getall : function (req , res)
  {
      var data = {"Status":0,"Message":""};   
      db.query("SELECT * from ServicesList",function(error, result, fields)
			          {
						if(error)
			             { 
                          		data["Message"] = "Sorry List Not Found .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						    data["Status"] = 1;
							data["Message"] = result;
							data["url"] = "https://brightdeveloper.work/server/img/icons/";
							res.json(data);
						    	
						 }	
					  });
  },
  Getservicesrequest: function(req , res)
  {
      var UserID = req.params.UserID;
      var data = {"Status":0,"Message":""};   
      var query = db.query("SELECT (SELECT count(*)  FROM Estimation WHERE ServicesID = S.ID LIMIT 1) as quotes_count , (SELECT Status FROM Estimation WHERE ServicesID = S.ID LIMIT 1) as EstimationStatus , (SELECT Status FROM ServicesFunction WHERE ServicesID = S.ID LIMIT 1) as Workingstatus , S.ID ,S.USERID ,S.ADDRESS ,S.LAT,S.LNG,S.URGENCY,S.PROBLEM,S.DESCRIPTION,S.SERVICEID,S.SERVICENAME  from Services AS S WHERE USERID = ?",[UserID],function(error, result, fields)
			          {
			              console.log(query.sql);
						if(error)
			             { 
                          		data["Message"] = "Sorry List Not Found .";
							    res.json(data);			 
						 }
						 else
						 {
						     
						    data["Status"] = 1;
							data["Message"] = result;
							res.json(data);
						    	
						 }	
					  });
  },
  
    SendRequest : function(req , res)
    {
        var user_id = req.body.user_id;
        var member_id = req.body.member_id;
        var status = req.body.status;

        
        var data = {"Status":0,"Message":""};
        if(!!user_id && !!member_id)
        {

            db.query("INSERT INTO Request VALUES('',?,?,?)",[user_id,member_id,status],function(error, result, fields)
                          {
                            if(error)
                             { 
                                    data["Message"] = "Error Adding Data .";
                                    res.json(data);			 
                             }
                             else
                             {

                                data["Status"] = 1;
                                data["Message"] = "Request Has Been Send Successfully";
                                data["Requestid"] = result.insertId;
                                data["Body"] = req.body;
                                res.json(data);

                             }	
                          });
           }
           else
           {
                data["Message"] = "Please Provide All Required Data (i.e : user_id,member_id)";
                res.json(data);
           }
    },
    GetInvitationRequests: function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        var query = db.query("SELECT  R.RequestID , R.UserOne , R.UserTwo , R.Status , U.Fname , U.Lname , U.Email , U.Id ,U.ProfilePic , U.ContactNo , U.CompanyName , U.Address , U.LicenceNo , U.LicenceImage , U.NoOfTechnicians , U.OtherCertificate , U.Skill , U.UserType , U.DeviceId , U.DeviceType , U.Latitude , U.Longitude ,U.Experience , U.services_provided , U.services_names from Request AS R JOIN User AS U ON U.Id = R.UserOne WHERE  R.UserTwo = ? AND R.Status = 0 ",[UserID],function(error, result, fields)
			          {
            
			              console.log(query.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    },
    FriendList : function(req , res)
    {
        var UserID = req.params.UserID;
        var data = {"Status":0,"Message":""};
        
        var query = db.query("SELECT  R.RequestID , R.UserOne , R.UserTwo , R.Status , U.Fname , U.Lname , U.Email , U.Id ,U.ProfilePic , U.ContactNo , U.CompanyName , U.Address , U.LicenceNo , U.LicenceImage , U.NoOfTechnicians , U.OtherCertificate , U.Skill , U.UserType , U.DeviceId , U.DeviceType , U.Latitude , U.Longitude ,U.Experience , U.services_provided , U.services_names from User U , Request R WHERE CASE WHEN R.UserOne = "+UserID+" THEN R.UserTwo = U.Id WHEN R.UserTwo = "+UserID+" THEN R.UserOne = U.Id END AND R.Status = '1'",[UserID],function(error, result, fields)
			          {
            
			              console.log(query.sql);
						if(result.length > 0)
			             { 
			                 
			                 data["Status"] = 1;
							 data["Message"] = result;
							 data["url"] = "https://brightdeveloper.work/server/img/";
							 res.json(data);
                          					 
						 }
						 else
						 {
						     
						        data["Message"] = "Sorry List Not Found .";
							    res.json(data);
						    	
						 }	
					  });
    }
    ,
    ApproveInvitation : function(req , res)
    {
         var inviter_id = req.body.inviter_id;
         var status = req.body.status;
         var data = {"Status":0,"Message":""};
        if(!!inviter_id && !!status)
        {
            
            db.query("UPDATE Request SET Status=? WHERE RequestID=?",[status,inviter_id],function(err, rows, fields)
	       {
             
	       });
	       
    	     data["Status"] = 1;
    	     data["Message"] = "Invitation Has Been ApproveD Successfully";
    	     res.json(data); 
            
            
            
        }
        else
    	{
            data["Message"] = "Please Provide All Required Data (i.e : user_id , quote_id)";
            res.json(data);
        } 
    }
 
};

function Workingstatus(ID)
{
    //return ID;
     
   var query =   db.query("SELECT * from ServicesFunction JOIN User ON User.ID = ServicesFunction.TechnicianID WHERE  ServicesID = ?",[ID],function(error, result, fields)
			          {
					       console.log(error);	 
						   return result;
						  	
					  });
					  
}


 
module.exports = services;
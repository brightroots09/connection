var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var datetime = require('node-datetime');
//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });

 
var auth = require('./auth.js');
var products = require('./products.js');
var user = require('./users.js');
var signup = require('./signup.js');
var Login = require('./Login.js');
var Services = require('./services.js');
 
/*
 * Routes that can be accessed by any one
 */
// router.post('/login', auth.login);

/*
 * Routes that can be accessed only by autheticated users
 */

router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);
 
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);

 /*
 * Routes that can be accessed only by authenticated & authorized users
 */
 router.get('/api/v1/Signup/Test', signup.Test);
 router.post('/api/v1/Signup/Users', signup.Signupuser);
 router.put('/api/v1/Signup/Update', signup.UpdateUserdata);
 router.post('/api/v1/Signup/Contractor', signup.SignupContractor);
 router.post('/api/v1/Signup/Technician', signup.SignupTechnician);
 router.post('/api/v1/Signup/UploadImage/',  signup.UploadImage);

 
 router.post('/api/v1/Login', Login.Action);
 router.post('/api/v1/Logout', Login.Logout);
 
 router.post('/api/v1/Services',Services.CreateRequest);
 router.get('/api/v1/Services',Services.Getall);
 router.get('/api/v1/Getservicesrequest/:UserID',Services.Getservicesrequest);
 router.post('/api/v1/Services/Estimation',Services.CreateEstimation);
 router.post('/api/v1/Services/DeleteServicesAndEstimation',Services.DeleteServicesAndEstimation);
 router.put('/api/v1/Services/ApproveQuote',Services.ApproveQuote);
 router.get('/api/v1/Services/GetQuotes/:JobID',Services.GetQuotes);
 router.post('/api/v1/Services/GetRequests',Services.GetRequests);
 router.post('/api/v1/GetAllTechnicians', Services.GetAllTechnicians);
 router.post('/api/v1/AddTechnician', Services.AddTechnician);
 router.put('/api/v1/AcceptTechnicianRequest', Services.AcceptTechnicianRequest);
 router.get('/api/v1/GetTechnician/:UserID', Services.GetTechnician);
 router.post('/api/v1/AssignJob/', Services.AssignJob);
 router.put('/api/v1/AcceptJobByTechnician/', Services.AcceptJobByTechnician);
 router.get('/api/v1/GetTechnicianJob/:UserID', Services.GetTechnicianJob);
 router.post('/api/v1/GetJobDetails/', Services.GetJobDetails);
 router.get('/api/v1/GetUserDetails/:UserID', Services.GetUserDetails);
 router.get('/api/v1/GetQuoteDetails/:JobId', Services.GetQuoteDetails);
 router.get('/api/v1/GetContractorsrequests/:UserID', Services.GetContractorsrequests);
 router.post('/api/v1/SaveEstimation', Services.SaveEstimation);
 router.get('/api/v1/GetUserEstimation/:UserID', Services.GetUserEstimation);
 router.post('/api/v1/CreateInvoice', Services.CreateInvoice);
 router.get('/api/v1/GetInvoiceDetail/:user_id/:job_id', Services.GetInvoiceDetail);
 router.post('/api/v1/GetNearByUsers', Services.GetNearByUsers);
 //router.post('/api/v1/ChatConnect', Services.ChatConnect);
 router.post('/api/v1/SendRequest', Services.SendRequest);
 router.get('/api/v1/GetInvitationRequests/:UserID', Services.GetInvitationRequests);
 router.post('/api/v1/ApproveInvitation', Services.ApproveInvitation); 
 router.post('/api/v1/CreateGroup', Services.CreateGroup); 
 router.post('/api/v1/AddAndDeleteMember', Services.AddAndDeleteMember); 
 router.get('/api/v1/ChatList/:UserID', Services.ChatList); 
 router.get('/api/v1/ChatDetails/:UserID/:FriendID/:GroupID', Services.ChatDetails); 
 router.get('/api/v1/FriendList/:UserID', Services.FriendList); 
 router.get('/api/v1/GetGroupmembers/:GroupID', Services.GetGroupmembers);   
 router.get('/api/v1/Checknotification', Services.TestNotifi);
 router.get('/api/v1/GetGroupnotmembers/:GroupID/:UserID', Services.GetGroupnotmembers);


// post 

 router.post('/api/v1/CreatePost', Services.CreatePost);
 router.get('/api/v1/GetPost/:UserID', Services.GetPost);


 //router.put('/api/v1/Chatchecking', Services.chatchecking);


module.exports = router;

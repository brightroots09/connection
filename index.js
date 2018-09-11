var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');
//var fileUpload = require('express-fileupload');
var async = require("async");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base64 = require('base-64');
//io.listen(http);
const moment = require("moment");

var notify = require('push-notify');
var apn = require('apn');


const passport = require("passport");
const session = require("express-session");
const Store = require("express-session").Store
const BetterMemoryStore = require('session-memory-store')(session);
const flash = require("express-flash");




var options = {
    token: {
        key: __dirname + '/server/push/AuthKey_NAQY8A83XB.p8',
        keyId: "NAQY8A83XB",
        teamId: "E6MMJ8JFC4"
    },
    production: false
};
var apnProvider = new apn.Provider(options);



var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'brightde_scuser',
    password: '*]}Q]cPR{(vR',
    database: 'brightde_SC'
});

app.use(logger('dev'));
//app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});







io.on('connection', function (socket) {

    console.log('client connect');


    socket.on('disconnect', function () {
        console.log('user disconnected');

    });

    socket.on('video message', function (data) {


        var name = data.username;
        var userid = data.userid;
        var friendid = data.friendid;
        var message = data.message;
        var date = data.datetime;
        var duration = data.duration;
        var msg = '';
        var filter_password = data.filter_password;
        var bytes = utf8.encode(msg);
        var encoded = base64.encode(bytes);
        var image_filter = data.image_filter;

        var buf = new Buffer(data.message, 'base64');
        var imagename = friendid + userid + Date.now() + '.mp4';

        fs.writeFile(__dirname + '/img/chat/' + imagename, buf, 'base64', function (err) {


        });

        if (data.thumb != undefined) {
            var buf1 = new Buffer(data.thumb, 'base64');
            var imagenamethumb = imagename + '.png';

            fs.writeFile(__dirname + '/img/chat/' + imagenamethumb, buf1, 'base64', function (err) {


            });
        }


        socket.broadcast.emit('video message', {
            username: data.username,
            userid: data.userid,
            friendid: data.friendid,
            message: imagename,
            datetime: data.datetime,
            recieved_by: data.friendid,
            Chatid: chatid,
            Duration: duration,
            filter_password: data.filter_password,
            image_filter: data.image_filter,
            password_filter: data.password_filter
        });

        socket.emit('video message', {
            username: data.username,
            userid: data.userid,
            friendid: data.friendid,
            message: imagename,
            datetime: data.datetime,
            recieved_by: data.friendid,
            Chatid: chatid,
            Duration: duration,
            filter_password: data.filter_password,
            image_filter: data.image_filter,
            password_filter: data.password_filter

        });

    });


    socket.on('image message', function (data) {

        console.log(data);
        //console.log(data);
        var username = data.username;
        var userid = data.userid;
        var friendid = data.friendid;
        var message = data.message;
        var date = data.datetime;
        var userimage = data.userimage;
        var ChatType = data.Type

        if (!!data.GroupID) {
            var GroupID = data.GroupID;
        }
        else {
            var GroupID = "";
        }

        var buf = new Buffer(data.message, 'base64');
        var imagename = friendid + userid + Date.now() + '.png';

        fs.writeFile(__dirname + '/server/img/' + imagename, buf, 'base64', function (err) {


        });


        connection.query("INSERT INTO Chat VALUES('',?,?,'',?,?,?,?,?,?)", [userid, friendid, imagename, date, username, userimage, ChatType, GroupID], function (err, rows, fields) {


            if (err) {
                console.log(err);
            }

            socket.broadcast.emit('image message', {
                username: data.username,
                userid: data.userid,
                friendid: data.friendid,
                message: imagename,
                datetime: data.datetime,
                recieved_by: data.friendid,
                userimage: data.userimage,
                Type: data.Type,
                GroupID: GroupID
            });

            socket.emit('image message', {
                username: data.username,
                userid: data.userid,
                friendid: data.friendid,
                message: imagename,
                datetime: data.datetime,
                recieved_by: data.friendid,
                userimage: data.userimage,
                Type: data.Type,
                GroupID: GroupID
            });




            /***************   Notification Code ********************/
            if (ChatType == "groupChat") {
                var array = friendid.split(',');
                var newfrndid = array.splice(array.indexOf(userid), 1);

                var q = connection.query("SELECT * FROM User WHERE Id IN(?)", [array], function (err, rows, fields) {
                    // console.log(q.sql);

                    async.each(rows, function (row, callback) {

                        if (row.Id != userid) {
                            connection.query("SELECT * FROM User WHERE Id =" + userid + "", [userid], function (errs, rowsnew, fields) {

                                if (rowsnew[0].CompanyName != "") {
                                    var name = rowsnew[0].CompanyName;
                                }
                                else {
                                    var name = rowsnew[0].Fname + ' ' + rowsnew[0].Lname;
                                }
                                //console.log(row)      

                                let deviceToken = row.DeviceId;
                                var note = new apn.Notification();
                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                note.badge = 0;
                                note.sound = "default";
                                note.alert = { "title": name, "body": data.message };
                                //note.payload = {'messageFrom': 'John Appleseed'};
                                note.topic = "com.ServiceConnection";
                                note.rawPayload = {
                                    from: "node-apn",
                                    source: "web",
                                    aps: {
                                        "notification_type": "groupChat",
                                        "badge": 0,
                                        "sound": "default",
                                        "alert": { "title": name, "body": data.message },
                                        "content-available": 1,
                                        "username": data.username,
                                        "userid": data.userid,
                                        "friendid ": data.friendid,
                                        "message": imagename,
                                        "datetime": data.datetime,
                                        "recieved_by": data.friendid,
                                        "userimage": data.userimage,
                                        "Type": data.Type,
                                        "GroupID": GroupID
                                    }
                                };


                                apnProvider.send(note, deviceToken).then((result) => {
                                    // see documentation for an explanation of result

                                    console.log(result);
                                    console.log(result.response);

                                });
                            });
                        }




                    });





                });
            }
            else {

                connection.query("SELECT * FROM User WHERE Id =" + friendid + "", [friendid], function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    }
                    //console.log(rows)
                    async.each(rows, function (row, callback) {

                        connection.query("SELECT * FROM User WHERE Id =" + userid + "", [userid], function (errs, rowsnew, fields) {

                            if (rowsnew[0].CompanyName != "") {
                                var name = rowsnew[0].CompanyName;
                            }
                            else {
                                var name = rowsnew[0].Fname + ' ' + rowsnew[0].Lname;
                            }
                            //console.log(row)      

                            let deviceToken = row.DeviceId;
                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 0;
                            note.sound = "default";
                            note.alert = { "title": name, "body": data.message };
                            //note.payload = {'messageFrom': 'John Appleseed'};
                            note.topic = "com.ServiceConnection";
                            note.rawPayload = {
                                from: "node-apn",
                                source: "web",
                                aps: {
                                    "notification_type": "single",
                                    "badge": 0,
                                    "sound": "default",
                                    "alert": { "title": name, "body": data.message },
                                    "content-available": 1,
                                    "username": data.username,
                                    "userid": data.userid,
                                    "friendid ": data.friendid,
                                    "message": imagename,
                                    "datetime": data.datetime,
                                    "recieved_by": data.friendid,
                                    "userimage": data.userimage,
                                    "Type": data.Type,
                                    "GroupID": GroupID
                                }
                            };


                            apnProvider.send(note, deviceToken).then((result) => {
                                // see documentation for an explanation of result

                                console.log(result);
                                console.log(result.response);

                            });
                        });



                    });





                });

            }




            //your quote is approved by user name


            /***************    Notification Code End **************/


        });



        //// old code 



    });



    socket.on('AddAndDeleteMember', function (data) {

        var members_id = data.members_id;
        var remove_members_id = data.remove_members_id;
        var group_id = data.group_id;
        var datas = { "Status": 0, "Message": "" };
        if (!!members_id && !!group_id) {
            db.query("UPDATE UserGroup SET MemberID=? WHERE GroupID=?", [members_id, group_id], function (err, rows, fields) {
                if (err) {
                    datas["Message"] = "Error Adding Data .";
                    //res.json(data);	
                    socket.broadcast.emit('AddAndDeleteMember', {
                        AllData: datas,
                        members_id: members_id,
                        group_id: group_id,
                        remove_members_id: remove_members_id
                    });

                    socket.emit('AddAndDeleteMember', {
                        AllData: datas,
                        members_id: members_id,
                        group_id: group_id,
                        remove_members_id: remove_members_id


                    });
                }
                else {

                    datas["Status"] = 1;
                    datas["Message"] = "Group Has Been Updated Successfully";
                    // datas["Body"] = req.body;
                    //res.json(data);
                    socket.broadcast.emit('AddAndDeleteMember', {
                        AllData: datas,
                        members_id: members_id,
                        group_id: group_id,
                        remove_members_id: remove_members_id
                    });

                    socket.emit('AddAndDeleteMember', {
                        AllData: datas,
                        members_id: members_id,
                        group_id: group_id,
                        remove_members_id: remove_members_id

                    });

                }

            });
        }
        else {
            datas["Message"] = "Please Provide All Required Data (i.e :group_id , members_id)";
            //res.json(data);

            socket.broadcast.emit('AddAndDeleteMember', {
                AllData: datas,
            });

            socket.emit('AddAndDeleteMember', {
                AllData: datas,

            });
        }
    });

    socket.on('51 api', function (data) {

        var GroupID = data.GroupID;
        var datas = { "Status": 0, "Message": "" };

        if (!!GroupID) {
            var q = db.query("SELECT * from UserGroup WHERE GroupID = ? ", [GroupID], function (error, result, fields) {
                //console.log(q.sql);
                if (result.length > 0) {
                    var MemberID = result[0].MemberID;
                    var array = MemberID.split(',');

                    //console.log(array);

                    var q = db.query("SELECT Id ,Fname ,Lname,Email,ContactNo,CONCAT('https://brightdeveloper.work/server/img/',ProfilePic) AS ProfilePic,CompanyName from User WHERE Id NOT IN(" + array + ")", [GroupID], function (error, rows, fields) {
                        console.log(q.sql);
                        if (rows.length > 0) {

                            datas["Status"] = 1;
                            datas["Message"] = rows;
                            datas["AdminID"] = result[0].UserID;

                            socket.broadcast.emit('new message', {
                                AllData: datas,
                            });

                            socket.emit('new message', {
                                AllData: datas,

                            });
                            //res.json(data);				 
                        }
                        else {
                            datas["Message"] = "Sorry Member Not Found .";
                            // res.json(data);
                            socket.broadcast.emit('new message', {
                                AllData: datas,
                            });

                            socket.emit('new message', {
                                AllData: datas,

                            });

                        }

                    });


                }
                else {
                    datas["Message"] = "Sorry Group  Not Found .";
                    //res.json(data);
                    socket.broadcast.emit('new message', {
                        AllData: datas,
                    });

                    socket.emit('new message', {
                        AllData: datas,

                    });

                }

            });
        }
        else {
            datas["Message"] = "Please Provide All Required Data (i.e : GroupID )";
            //res.json(data);
            socket.broadcast.emit('new message', {
                AllData: datas,
            });

            socket.emit('new message', {
                AllData: datas,

            });
        }
    });


    socket.on('new message', function (data) {
        console.log(data);
        //console.log(data);
        var username = data.username;
        var userid = data.userid;
        var friendid = data.friendid;
        var message = data.message;
        var date = data.datetime;
        var userimage = data.userimage;
        var ChatType = data.Type

        if (!!data.GroupID) {
            var GroupID = data.GroupID;
        }
        else {
            var GroupID = "";
        }


        connection.query("INSERT INTO Chat VALUES('',?,?,?,'',?,?,?,?,?)", [userid, friendid, message, date, username, userimage, ChatType, GroupID], function (err, rows, fields) {


            if (err) {
                console.log(err);
            }

            socket.broadcast.emit('new message', {
                username: data.username,
                userid: data.userid,
                friendid: data.friendid,
                message: data.message,
                datetime: data.datetime,
                recieved_by: data.friendid,
                userimage: data.userimage,
                Type: data.Type,
                GroupID: GroupID
            });

            socket.emit('new message', {
                username: data.username,
                userid: data.userid,
                friendid: data.friendid,
                message: data.message,
                datetime: data.datetime,
                recieved_by: data.friendid,
                userimage: data.userimage,
                Type: data.Type,
                GroupID: GroupID
            });




            /***************   Notification Code ********************/
            if (ChatType == "groupChat") {
                var array = friendid.split(',');
                var newfrndid = array.splice(array.indexOf(userid), 1);

                var q = connection.query("SELECT * FROM User WHERE Id IN(?)", [array], function (err, rows, fields) {
                    // console.log(q.sql);

                    async.each(rows, function (row, callback) {

                        if (row.Id != userid) {
                            connection.query("SELECT * FROM User WHERE Id =" + userid + "", [userid], function (errs, rowsnew, fields) {

                                if (rowsnew[0].CompanyName != "") {
                                    var name = rowsnew[0].CompanyName;
                                }
                                else {
                                    var name = rowsnew[0].Fname + ' ' + rowsnew[0].Lname;
                                }
                                //console.log(row)      

                                let deviceToken = row.DeviceId;
                                var note = new apn.Notification();
                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                note.badge = 0;
                                note.sound = "default";
                                note.alert = { "title": name, "body": data.message };
                                //note.payload = {'messageFrom': 'John Appleseed'};
                                note.topic = "com.ServiceConnection";
                                note.rawPayload = {
                                    from: "node-apn",
                                    source: "web",
                                    aps: {
                                        "notification_type": "groupChat",
                                        "badge": 0,
                                        "sound": "default",
                                        "alert": { "title": name, "body": data.message },
                                        "content-available": 1,
                                        "username": data.username,
                                        "userid": data.userid,
                                        "friendid ": data.friendid,
                                        "message": data.message,
                                        "datetime": data.datetime,
                                        "recieved_by": data.friendid,
                                        "userimage": data.userimage,
                                        "Type": data.Type,
                                        "GroupID": GroupID
                                    }
                                };


                                apnProvider.send(note, deviceToken).then((result) => {
                                    // see documentation for an explanation of result

                                    console.log(result);
                                    console.log(result.response);

                                });
                            });
                        }




                    });





                });
            }
            else {

                connection.query("SELECT * FROM User WHERE Id =" + friendid + "", [friendid], function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    }
                    //console.log(rows)
                    async.each(rows, function (row, callback) {

                        connection.query("SELECT * FROM User WHERE Id =" + userid + "", [userid], function (errs, rowsnew, fields) {

                            if (rowsnew[0].CompanyName != "") {
                                var name = rowsnew[0].CompanyName;
                            }
                            else {
                                var name = rowsnew[0].Fname + ' ' + rowsnew[0].Lname;
                            }
                            //console.log(row)      

                            let deviceToken = row.DeviceId;
                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 0;
                            note.sound = "default";
                            note.alert = { "title": name, "body": data.message };
                            //note.payload = {'messageFrom': 'John Appleseed'};
                            note.topic = "com.ServiceConnection";
                            note.rawPayload = {
                                from: "node-apn",
                                source: "web",
                                aps: {
                                    "notification_type": "single",
                                    "badge": 0,
                                    "sound": "default",
                                    "alert": { "title": name, "body": data.message },
                                    "content-available": 1,
                                    "username": data.username,
                                    "userid": data.userid,
                                    "friendid ": data.friendid,
                                    "message": data.message,
                                    "datetime": data.datetime,
                                    "recieved_by": data.friendid,
                                    "userimage": data.userimage,
                                    "Type": data.Type,
                                    "GroupID": GroupID
                                }
                            };


                            apnProvider.send(note, deviceToken).then((result) => {
                                // see documentation for an explanation of result

                                console.log(result);
                                console.log(result.response);

                            });
                        });



                    });





                });

            }




            //your quote is approved by user name


            /***************    Notification Code End **************/


        });



    });


    socket.on('typing', function (data) {
        console.log(data);
        socket.broadcast.emit('typing', {
            username: data.username,
            recieved_by: data.friendid,
            userid: data.userid,
            GroupID: data.GroupID,
            Type: data.Type,
        });

        socket.emit('typing', {
            username: data.username,
            recieved_by: data.friendid,
            userid: data.userid,
            GroupID: data.GroupID,
            Type: data.Type,

        });
    });


    socket.on('stop typing', function (data) {
        console.log(data);
        socket.broadcast.emit('stop typing', {
            username: data.username,
            recieved_by: data.friendid,
            userid: data.userid,
            GroupID: data.GroupID,
            Type: data.Type,
        });
        socket.emit('stop typing', {
            username: data.username,
            recieved_by: data.friendid,
            userid: data.userid,
            GroupID: data.GroupID,
            Type: data.Type,

        });
    });


});


// Make io accessible to our router
app.use(function (req, res, next) {
    req.io = io;
    next();
});





/*app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
*/

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./server/middlewares/validateRequest')]);

app.use('/', require('./server/routes'));

app.use('/images', express.static(__dirname + '/uploads'));
//app.use(express.static('uploads'));









/****** admin code *****/

const sqlConnection = require("./connection/sql_connection");
const model = require("./models");

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Routes

const admin = require("./routes/admin");


var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

app.use(session({

    name: 'SESSION',

    secret: 'TEST',

    store: store,

    resave: true,

    saveUninitialized: true

}));



app.use(passport.initialize());
app.use(passport.session())


app.use(flash());
app.use(function (req, res, cb) {
    res.locals.user = req.user;
    res.locals.moment = moment;
    cb()
});

app.use(admin);
app.get("*", (req, res, callback) => {
    res.render("index.html")
})

// If no route is matched by now, it must be a 404
// app.use(function (req, res, next) {

//     var stack = admin.stack;
//     var layers = stack.map(l => l.name)
//     var nowRoute = stack.filter(l => {
//         if (l.route) {
//             if (req.path == l.route.path) {
//                 app.use(admin);
//                 app.get("*", (req, res, callback) => {
//                     res.render("index.html")
//                 })

//                 next();
//             }
//             else {
//                 var err = new Error('Not Found');
//                 err.status = 404;
//                 next(err);
//             }

//         }


//     })


// });





sqlConnection();
model.model_index();

/***** admin code code *****/




// Start the server
app.set('port', process.env.PORT || 3030);

var server = http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
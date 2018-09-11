var express = require("express");
var router = express.Router();
var common_function = require("../functions/common_functions");
var nodemailer = require('nodemailer');
var async = require("async")
const passport = require("passport");
const passportConfig = require("./passport");
const ensureAuthenticated = require("./auth");

var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google'
};
var geocoder = NodeGeocoder(options);

/**
 * ---------
 * DASHBOARD
 * ---------
 */

router.get("/", function (req, res, callback) {
    if (req.user) {

        var tasks = []

        tasks.push(common_function.customer_count.bind(null, "customer"))
        tasks.push(common_function.contractor_count.bind(null, "contractor"))
        tasks.push(common_function.technician_count.bind(null, "technician"))

        async.parallel(tasks, function (error, result) {
            if (error) callback(error)
            else {
                res.render("index.html", {
                    result: {
                        customers: result[0][0].count,
                        contractors: result[1][0].count,
                        technicians: result[2][0].count,
                    }
                })
            }
        })
    }
    else {
        res.redirect("/login")
    }
})

router.get("/login", function (req, res, callback) {
    if (req.user) return res.redirect("/")
    else {

        const table = "admin";
        const condition = {
            id: 1,
            email: "admin@admin.com",
            name: "Admin",
            password: "admin@admin.com"
        }

        var tasks = [];

        tasks.push(common_function.addAdmin.bind(null, table, condition))

        async.series(tasks, function (error, result) {

            if (error) callback(error)
            else {
                res.render("admin_login.html", {
                    message: req.flash("loginMessage")
                })
            }

        })
    }
})

router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))


router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
})

/**
 * -----------------
 * GET ALL CUSTOMERS
 * -----------------
 */
router.get("/users", function (req, res, callback) {
    if (req.user) {
        res.render("admin/region.html")
    }
    else {
        res.redirect("/login")
    }
})

router.get("/india", function(req, res, callback){
    if(req.user){
        res.render("admin/region_ind.html")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/usa", function(req, res, callback){
    if(req.user){
        res.render("admin/region_usa.html")
    }
    else{
        res.redirect("/login")
    }
})

router.get("/user/:region", function (req, res, callback) {
    if (req.user) {
        const table = "User"

        geocoder.geocode(`${req.params.region}`, function (err, response) {
            if (response) {
                const condition = {
                    fields: "*",
                    user_type: "",
                    where: `SQRT(POW(User.Latitude - ${response[0].latitude}, 2) + POW(User.Longitude - ${response[0].longitude}, 2)) * 100 < 130`
                }

                common_function.getAllUser(table, condition, function (error, users) {
                    if (error) callback(error)
                    else {
                        res.render("admin/view_users.html", {
                            users: users
                        })
                    }
                })
            }
            else {
                res.redirect(`/user/${req.params.region}`)
            }
        });

    }
    else {
        res.redirect("/login")
    }
})

router.post("/add_user", function (req, res, callback) {
    console.log(req.body)
})



/**
 * ----------------------
 * GET CONTRACTOR DETAILS
 * ----------------------
 */
router.get("/contractor_details/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        const condition = {
            id: req.params.id,
            fields: "User.*",
            additional: "estimation.PricePerHour, estimation.TravelCharges, estimation.TruckCharges, estimation.ETA, estimation.DiagnosticCharges",
            join: "LEFT JOIN EstimationSetting estimation ON estimation.UserID = User.Id"
        }

        common_function.getUserById(table, condition, function (error, contractor) {
            if (error) callback(error)
            else {
                res.render("admin/view_contractor_details.html", {
                    result: contractor
                })
            }
        })
    } else {
        res.redirect("/login")
    }

})

/**
 * --------------------
 * GET CUSTOMER DETAILS
 *---------------------
 */
router.get("/customer_details/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        const condition = {
            id: req.params.id,
            fields: "User.*"
        }

        common_function.getUserById(table, condition, function (error, customer) {
            if (error) callback(error)
            else {
                console.log(customer)
                res.render("admin/view_customer_details.html", {
                    result: customer
                })
            }
        })
    }
    else {
        res.redirect("/login")
    }

})

/**
 * ----------------------
 * GET TECHNICIAN DETAILS
 * ----------------------
 */
router.get("/technicians_details/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        const condition = {
            id: req.params.id,
            fields: "User.*"
        }
        common_function.getUserById(table, condition, function (error, technician) {
            if (error) callback(error)
            else {
                console.log(technician)
                res.render("admin/view_technician_details.html", {
                    result: technician
                })
            }
        })
    } else {
        res.redirect("/login")
    }
})

/**
 * -------------
 * EDIT CUSTOMER
 * -------------
 */
router.post("/edit_customer/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        condition = {
            id: req.params.id,
            update: `fname='${req.body.first_name}', lname='${req.body.last_name}', email='${req.body.email}', contactno=${req.body.phone_number}`
        }

        common_function.editCustomerById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect(`/customer_details/${req.params.id}`)
            }
        })
    } else {
        res.redirect("/login")
    }

})

/**
 * ---------------
 * EDIT CONTRACTOR
 * ---------------
 */
router.post("/edit_contractor/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        condition = {
            id: req.params.id,
            update: `CompanyName='${req.body.company_name}', Address='${req.body.address}', NoOfTechnicians='${req.body.no_of_technicians}', LicenceNo='${req.body.licence_no}', Email='${req.body.email}', ContactNo='${req.body.phone_no}'`
        }

        common_function.editCustomerById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect(`/customer_details/${req.params.id}`)
            }
        })
    } else {
        res.redirect("/login")
    }

})

/**
 * ---------------
 * EDIT TECHNICIAN
 * ---------------
 */
router.post("/edit_technician/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        condition = {
            id: req.params.id,
            update: `fname='${req.body.first_name}', lname='${req.body.last_name}', email='${req.body.email}', ContactNo='${req.body.phone_number}', CompanyName='${req.body.company_name}', Skill='${req.body.designation}', LicenceNo='${req.body.licence_no}'`
        }

        common_function.editCustomerById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect(`/customer_details/${req.params.id}`)
            }
        })
    } else {
        res.redirect("/login")
    }

})

/**
 * -----------
 * DELETE USER
 * -----------
 */
router.post("/delete_user/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        condition = {
            where: `id = ${req.params.id}`
        }

        common_function.deleteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/users")
            }
        })
    }
    else {
        res.redirect("/login")
    }

})

/**
 * ------------------------------
 * SEND CUSTOMER DETAIL VIA EMAIL
 * ------------------------------
 */
router.post("/send_email/:id", function (req, res, callback) {
    if (req.user) {
        const table = "User";
        const condition = {
            id: req.params.id,
            fields: "fname, lname, email, password, contactno, profilepic"
        }

        common_function.getUserById(table, condition, function (error, customer) {
            if (error) callback(error)
            else {
                var transporter = nodemailer.createTransport({
                    host: 'sg1-ls1.a2hosting.com',
                    auth: {
                        user: 'brightroots09@brightroots.net',
                        pass: 'j%33gLLY+Gkt'
                    }
                });

                var mailOptions = {
                    from: 'brightroots09@brightroots.net',
                    to: `${customer[0].email}`,
                    subject: 'Credentials',
                    text: `Your Email: ${customer[0].email}, Your Password: ${customer[0].password}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        callback(error);
                    } else {
                        res.redirect(`/customer_details/${req.params.id}`)
                    }
                });
            }
        })
    } else {
        res.redirect("/login")
    }
})


/**
 * ------------
 * GET ALL JOBS
 * ------------
 */
router.get("/jobs", function (req, res, callback) {
    if (req.user) {
        const table = `ServicesFunction`
        const condition = {
            fields: `Services.ID as service_id, Services.ADDRESS, Services.URGENCY, Services.PROBLEM, Services.DESCRIPTION, Services.SERVICENAME, cust.Fname as customer_Fname, cust.Lname as customer_Lname, cust.CompanyName as customer_company_name, cont.Fname as contractor_Fname, cont.Lname as contractor_Lname, cont.CompanyName as contactor_company_name, tech.Fname as technician_Fname, tech.Lname as technician_Lname, tech.CompanyName as technician_comapny_name`,
            join: `Left JOIN Services on Services.ID = ServicesFunction.ServicesID LEFT JOIN User cust ON cust.Id = Services.UserId LEFT JOIN User cont ON cont.Id = ServicesFunction.ContractorID LEFT JOIN User tech ON tech.Id = ServicesFunction.TechnicianID`,
            where: `""`
        }
        common_function.getAllJobs(table, condition, function (error, jobs) {
            if (error) callback(error)
            else {
                console.log(jobs)
                res.render("admin/view_jobs.html", {
                    jobs: jobs
                })
            }
        })
    } else {
        res.redirect("/login")
    }
})

/**
 * -------------------------
 * GET PARTICULAR JOB DETAIL
 * -------------------------
 */
router.get("/job/:id", function (req, res, callback) {
    if (req.user) {
        const table = `ServicesFunction`
        const condition = {
            fields: `
        Services.ADDRESS, Services.URGENCY, Services.PROBLEM, Services.DESCRIPTION, Services.SERVICENAME, cust.Fname as customer_Fname, cust.Lname as customer_Lname, cust.ProfilePic as customer_profile, cont.CompanyName as company_name, cont.Fname as contractor_Fname, cont.Lname as contractor_Lname, tech.Fname as technician_Fname, tech.Lname as technician_Lname, Estimation.PricePerHour as estimate_price_charge, Estimation.DiagnosticCharges as estimate_diagnostic_charge
        `,
            id: req.params.id,
            join: `
        Left JOIN Services on Services.ID = ServicesFunction.ServicesID LEFT JOIN User cust ON cust.Id = Services.USERID LEFT JOIN User cont ON cont.Id = ServicesFunction.ContractorID LEFT JOIN User tech ON tech.Id = ServicesFunction.TechnicianID LEFT JOIN ESTIMATION ON Estimation.ServicesID = Services.ID
        `
        }
        common_function.getJobById(table, condition, function (error, jobs) {
            if (error) callback(error)
            else {
                console.log(jobs)
                res.render("admin/view_job_details.html", {
                    result: jobs
                })
            }
        })
    } else {
        res.redirect("/login")
    }
})

/**
 * -------------------
 * EDIT PARTICULAR JOB
 * -------------------
 */
router.post("/edit_job/:id", function (req, res, callback) {
    if (req.user) {
        const table = "Services"
        const condition = {
            id: req.params.id,
            update: `Services.SERVICENAME='${req.body.service_name}', Services.ADDRESS='${req.body.address}', Services.URGENCY='${req.body.urgency}'`,
            where: `Services.ID=${req.params.id}`
        }

        common_function.editJobById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/jobs")
            }
        })
    }
    else {
        res.redirect("/login")
    }

})

/**
 * ---------------------
 * DELETE PARTICULAR JOB
 * ---------------------
 */
router.post("/delete_job/:id", function (req, res, callback) {
    if (req.user) {
        const table = `Services`
        const condition = {
            where: `Services.ID = ${req.params.id}`
        }

        common_function.deleteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/jobs")
            }
        })
    }
    else {
        res.redirect("/login")
    }

})

/**
 * --------------
 * GET ALL QUOTES
 * --------------
 */
router.get("/quotes", function (req, res, callback) {
    if (req.user) {
        const table = `Estimation`
        const condition = {
            fields: `
        Estimation.ID, contractor.Fname as contractor_Fname, contractor.Lname as contractor_lastname, contractor.CompanyName as contractor_company_name, service.ADDRESS as service_address, service.URGENCY as service_urgency, service.PROBLEM as service_problem, service.DESCRIPTION as service_description, service.SERVICENAME as service_name, Estimation.PricePerHour, Estimation.TravelCharges, Estimation.TruckCharges, Estimation.ETA, Estimation.Status, Estimation.CreatedBy, Estimation.DiagnosticCharges, accepted_user.Fname as accepted_user_Fname, accepted_user.Lname as accepted_user_Lname, accepted_user.CompanyName as accepted_user_company_name
        `,
            join: `
        LEFT JOIN User contractor ON contractor.Id = Estimation.UserID LEFT JOIN User accepted_user ON accepted_user.Id = Estimation.AcceptedBy LEFT JOIN Services service ON service.ID = Estimation.ServicesID
        `

        }
        common_function.getQuote(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                console.log(result)
                res.render("admin/view_quotes.html", {
                    quotes: result
                })
            }
        })
    } else {
        res.redirect("/login")
    }
})

/**
 * --------------------
 * GET PARTICULAR QUOTE
 * --------------------
 */
router.get("/quote/:id", function (req, res, callback) {
    if (req.user) {
        const table = `Estimation`
        const condition = {
            fields: `
        Estimation.ID, contractor.Fname as contractor_Fname, contractor.Lname as contractor_lastname, service.ADDRESS as service_address, service.URGENCY as service_urgency, service.PROBLEM as service_problem, service.DESCRIPTION as service_description, service.SERVICENAME as service_name, Estimation.PricePerHour, Estimation.TravelCharges, Estimation.TruckCharges, Estimation.ETA, Estimation.Status, Estimation.CreatedBy, Estimation.DiagnosticCharges, accepted_user.Fname as accepted_user_Fname, accepted_user.Lname as accepted_user_Lname
        `,
            id: req.params.id,
            join: `
        LEFT JOIN User contractor ON contractor.Id = Estimation.UserID LEFT JOIN User accepted_user ON accepted_user.Id = Estimation.AcceptedBy LEFT JOIN Services service ON service.ID = Estimation.ServicesID
        `
        }

        common_function.getQuoteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                console.log(result)
                res.render("admin/view_quotes_details.html", {
                    quotes: result
                })
            }
        })
    }
    else {
        res.redirect("/login")
    }

})

/**
 * ---------------------
 * EDIT PARTICULAR QUOTE
 * ---------------------
 */

router.post("/edit_quote/:id", function (req, res, callback) {
    if (req.user) {
        const table = `Estimation`;
        const condition = {
            fields: `PricePerHour='${req.body.price_per_hour}', TravelCharges='${req.body.travel_charges}', TruckCharges='${req.body.truck_charges}', ETA='${req.body.eta}'`,
            id: req.params.id
        }

        common_function.editQuoteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect(`/quote/${req.params.id}`)
            }
        })
    }
    else {
        resw.redirect("/login")
    }

})


/**
 * -----------------------
 * DELETE PARTICULAR QUOTE 
 * -----------------------
 */
router.post("/delete_quote/:id", function (req, res, callback) {
    if (req.user) {
        const table = `Estimation`
        const condition = {
            where: `ID = ${req.params.id}`
        }

        common_function.deleteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                console.log(result)
                res.redirect("/quotes")
            }
        })
    }
    else {
        res.redirect("/login")
    }

})


/**
 * ----------------
 * GET ALL INVOICES 
 * ----------------
 */
router.get("/invoices", function (req, res, callback) {
    if (req.user) {
        const condition = {
            fields: ""
        }

        common_function.getAllInvoice(condition, function (error, result) {
            if (error) callback(error)
            else {
                console.log(result)
                res.render("admin/view_invoices.html", {
                    result: result
                })
            }
        })

    }
    else {
        res.redirect("/login")
    }
})


/**
 * ----------------------
 * GET PARTICULAR INVOICE 
 * ----------------------
 */
router.get("/invoice/:id", function (req, res, callback) {
    if (req.user) {
        const condition = {
            id: req.params.id
        }

        common_function.getInvoiceById(condition, function (error, result) {
            if (error) callback(error)
            else {
                res.render("admin/view_invoice_details.html", {
                    result: result
                })
            }
        })
    } else {
        res.redirect("/login")
    }

})

/**
 * -----------------------
 * EDIT PARTICULAR INVOICE 
 * -----------------------
 */
router.post("/edit_invoice/:id", function (req, res, callback) {
    if (req.user) {
        const table = "Invoice"
        const condition = {
            fields: `Amount=${req.body.invoice_amount}`,
            id: req.params.id
        }

        common_function.editInvoiceById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect(`/invoice/${req.params.id}`)
            }
        })
    }
    else {
        res.redirect("/login")
    }

})


/**
 * -------------------------
 * DELETE PARTICULAR INVOICE 
 * -------------------------
 */
router.post("/delete_invoice/:id", function (req, res, callback) {
    if (req.user) {
        const table = `Invoice`
        const condition = {
            where: `Invoice.InvoiceID = ${req.params.id}`
        }

        common_function.deleteById(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/invoices")
            }
        })

    }
    else {
        res.redirect("/login")
    }
})


/**
 * ----------------
 * GET ALL PAYMENTS 
 * ----------------
 */
router.get("/payments", function (req, res, callback) {
    if (req.user) {
        res.render("admin/view_payments.html")
    } else {
        res.redirect("/login")
    }
})

/**
 * ------------------------------
 * GET PARTICULAR PAYMENT DETAILS 
 * ------------------------------
 */
router.get("/payment/:id", function (req, res, callback) {
    if (req.user) {
        res.render("admin/view_payment_details.html")
    }
    else {
        res.redirect("/login")
    }
})


/**
 * ----------------
 * CHAT FORUM ROUTE
 * ----------------
 */

router.get("/chat_forum", function (req, res, callback) {
    if (req.user) {
        const table = "Post"
        const userTable = "User"

        const condition = {
            fields: "*",
            user_type: "",
            where: 1
        }

        var asyncTasks = [];

        asyncTasks.push(common_function.getChatForum.bind(null, table))
        asyncTasks.push(common_function.getAllUser.bind(null, userTable, condition))

        async.parallel(asyncTasks, function (error, chats) {
            if (error) callback(error)
            else {
                res.render("admin/chat_forum.html", {
                    chats: chats[0],
                    users: chats[1]
                })
            }
        })
    }
    else {
        res.redirect("/login")
    }
})

/**
 * -----------------
 * DELETE CHAT ROUTE
 * -----------------
 */

router.post("/delete_post/:id", function (req, res, callback) {
    if (req.user) {

        const table = "Post"
        const condition = {
            id: req.params.id
        }

        common_function.deletePost(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/chat_forum")
            }
        })
    }
    else {
        res.redirect("/login")
    }
})


/**
 * ---------------
 * EDIT CHAT ROUTE
 * ---------------
 */

router.post("/edit_post/:id", function (req, res, callback) {
    if (req.user) {
        const table = "Post"
        const condition = {
            id: req.params.id,
            field: `Description='${req.body.description}'`,
            data: req.body.description
        }

        common_function.editPost(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/chat_forum")
            }
        })

    }
    else {
        res.redirect("/login")
    }
})


/**
 * --------------
 * ADD CHAT ROUTE
 * --------------
 */

router.post("/chat_forum", function (req, res, callback) {
    if (req.user) {
        const table = "Post"
        const condition = {
            values: {
                "user_id": req.body.users,
                "description": req.body.description
            }
        }

        common_function.addPost(table, condition, function (error, result) {
            if (error) callback(error)
            else {
                res.redirect("/chat_forum")
            }
        })

    } else {
        res.redirect("/login")
    }
})


/**
 * ----------
 * CHAT ROUTE
 * ----------
 */

router.get("/chat/:id", function (req, res, callback) {
    if (req.user) {
        const table = "Chat"
        const condition = {
            where: `UserID=${req.user.Id} AND FriendID=${req.params.id}`
        }
        common_function.chatUser(table, condition, function(error, result){
            if(error) callback(error)
            else{
                res.json(result)
            }
        })
    }
    else {
        res.redirect("/login")
    }
})

module.exports = router;
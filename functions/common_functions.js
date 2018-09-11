exports.addAdmin            = addAdmin;
exports.getAdmin            = getAdmin;

exports.customer_count      = customer_count;
exports.contractor_count    = contractor_count;
exports.technician_count    = technician_count;

exports.getAllUser          = getAllUser;
exports.getUserById         = getUserById;
exports.editCustomerById    = editCustomerById;
exports.deleteById            = deleteById;

exports.getAllJobs          = getAllJobs;
exports.getJobById          = getJobById;
exports.editJobById         = editJobById;

exports.getQuote            = getQuote;
exports.getQuoteById        = getQuoteById;
exports.editQuoteById       = editQuoteById;

exports.getAllInvoice       = getAllInvoice;
exports.getInvoiceById      = getInvoiceById;
exports.editInvoiceById     = editInvoiceById;

exports.getChatForum        = getChatForum;
exports.deletePost          = deletePost;
exports.editPost            = editPost;
exports.addPost             = addPost;

exports.chatUser            = chatUser;

function addAdmin(table, condition, callback){
    let sql = `SELECT * from ${table} where email=?`
    con.query(sql, [`${condition.email}`], function(error, result){
        if(error) callback(error)
        if(result == ""){
            let sql = `INSERT into ${table} (id, name, email, password) values (?, ?, ?, ?)`;
            con.query(sql, [1,'Admin', 'admin@admin.com', 'admin@admin'], function(error, admin){
                if(error) callback(error)
                else{
                    callback(null, admin)
                }
            })
        }
        else{
            callback(null, result)
        }
    })
}

function getAdmin(table, condition, callback){
    let sql = `SELECT * from ${table} where email=?`

    con.query(sql, [condition.email], function(error, admin){
        if(error) callback(error)
        if(admin == ""){
            callback(null, "Wrong Email", null)
        }
        else if(admin[0].Password != condition.password){
            callback(null, "Wrong Password", null)
        }
        else {
            callback(null, null, admin)
        }
        
    })

}

function customer_count(user_type, callback){
    let sql = `
        SELECT COUNT(*) as count from User where User.UserType='${user_type}'
    `
    con.query(sql, function(error, count){
        if(error) callback(error)
        else{
            callback(null, count)
        }
    })
}

function contractor_count(user_type, callback){
    let sql = `
        SELECT COUNT(*) as count from User where User.UserType='${user_type}'
    `
    con.query(sql, function(error, count){
        if(error) callback(error)
        else{
            callback(null, count)
        }
    })
}

function technician_count(user_type, callback){
    let sql = `
        SELECT COUNT(*) as count from User where User.UserType='${user_type}'
    `
    con.query(sql, function(error, count){
        if(error) callback(error)
        else{
            callback(null, count)
        }
    })
}

function getAllUser(table, condition, callback) {
    let sql = `select ${condition.fields} from ${table} where ${condition.where} ORDER BY Id`
    con.query(sql, function (error, customer) {
        if (error) callback(error)
        else {
            callback(null, customer)
        }
    })
}

function getUserById(table, condition, callback){
    let sql;
    if(condition.join){
        sql =  `select ${condition.fields}, ${condition.additional} from ${table} ${condition.join} where User.id = ${condition.id} LIMIT 0,1`
    }
    else{
        sql =  `select ${condition.fields} from ${table}  where id = ${condition.id}`
    }
    con.query(sql, function(error, customer){
        if(error) callback(error)
        else{
            callback(null, customer)
        }
    })
}

function editCustomerById(table, condition, callback){
    let sql = `
    update ${table} set ${condition.update} where id = ${condition.id}
    `
    con.query(sql, function(error, customer){
        if(error) callback(error)
        else{
            callback(null, customer)
        }
    })
    
}

function deleteById(table, condition, callback){
    let sql = `delete from ${table} where ${condition.where}`
    
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}


function getAllJobs(table, condition ,callback){
    let sql = `
    SELECT ${condition.fields} from ${table} ${condition.join} where Services.Id != ${condition.where};
    `
    con.query(sql, function(error, jobs){
        if(error) callback(error)
        else{
            callback(null, jobs)
        }
    })
}

function getJobById(table, condition, callback){
    let sql = `
    SELECT ${condition.fields} from ${table} ${condition.join} where Services.ID=${condition.id};
    `
    con.query(sql, function(error, jobs){
        if(error) callback(error)
        else{
            callback(null, jobs)
        }
    })
}

function editJobById(table, condition, callback){
    let sql = `
        Update ${table} set ${condition.update} where ${condition.where}
    `
    console.log("============>",sql)

    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })
}

function getQuote(table, condition, callback){
    let sql = `
    SELECT ${condition.fields} from ${table} ${condition.join};
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else {
            callback(null, result)
        }
    })
}

function getQuoteById(table, condition, callback){
    let sql = `
    SELECT ${condition.fields} from ${table} ${condition.join} where Estimation.ID=${condition.id};
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function editQuoteById(table, condition, callback){
    let sql = `
        UPDATE ${table} set ${condition.fields} where Estimation.ID=${condition.id}
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}


function getAllInvoice(condition, callback){
    let sql = `
    SELECT Invoice.InvoiceID as invoice_id, user.Id as user_id, user.Fname as user_fname, user.Lname as user_lname, Invoice.Amount as amount from Invoice LEFT JOIN User user on user.Id = Invoice.UserID;
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function getInvoiceById(condition, callback){
    let sql = `
    SELECT Invoice.InvoiceID as invoice_id, user.Id as user_id, user.Fname as user_fname, user.Lname as user_lname, Invoice.Amount as amount from Invoice LEFT JOIN User user on user.Id = Invoice.UserID where Invoice.InvoiceID = ${condition.id};
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function editInvoiceById(table, condition, callback){
    let sql = `
        UPDATE ${table} set ${condition.fields} where Invoice.InvoiceID=${condition.id}
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function getChatForum(table, callback){
    let sql = `
        SELECT * from Post LEFT JOIN User ON User.Id = Post.UserID;
    `

    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function deletePost(table, condition, callback){
    let sql = `
        DELETE from ${table} where PostID=${condition.id}
    `

    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function editPost(table, condition, callback){
    let sql = `
        UPDATE ${table} set ${condition.field} where PostId=${condition.id}
    `
    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}

function addPost(table, condition, callback){
    let date = new Date()
    let sql = `
        INSERT into ${table} (UserID, Description, Photos, DateTime) values (?, ?, "", ?)
    `
    con.query(sql, [condition.values.user_id, condition.values.description, date], function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })
}


function chatUser(table, condition, callback){
    let sql = `
        SELECT * from ${table} where ${condition.where}
    `

    con.query(sql, function(error, result){
        if(error) callback(error)
        else{
            callback(null, result)
        }
    })

}
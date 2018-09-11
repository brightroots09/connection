var chat = require("./chat")
var estimation_setting = require("./estimation_setting");
var estimation = require("./estimation")
var invoice = require("./invoice")
var request = require("./request")
var services_function = require("./services_function")
var services_list = require("./services_list")
var services = require("./services")
var tech_relation_with_contr = require("./tech_relation_with_contr")
var token = require("./token")
var user_group = require("./user_group")
var user = require("./user")
var working_status = require("./working_status");
var admin = require("./admin");
var session = require("./session")


let model_index = async () => {
    try {
        await admin.sql_admin();
        await chat.sql_chat();
        await estimation_setting.sql_estimation_setting();
        await estimation.sql_estimation();
        await invoice.sql_invoice();
        await request.sql_request();
        await services_function.sql_services_function();
        await services_list.sql_services_list();
        await services.sql_services()
        await tech_relation_with_contr.sql_tech_relation_with_contr();
        await token.sql_token();
        await user_group.sql_user_group();
        await user.sql_user();
        await working_status.sql_working_status();
    } catch (error) {
        console.log("Error while executing tables")
    }

}



module.exports = {
    model_index
}
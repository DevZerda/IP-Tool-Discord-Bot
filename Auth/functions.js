// Modules 
const fs = require("fs");

// File
const Crud = require("./crud.js");

/*
*@param: discord_id
*@type [<boolean>]
*/
exports.isRegistered = function(userid) {
    if(userid.length === 0) { 
        return "[x] Error, No user set to check!";
    }

    let get_user = Crud.User(userid);

    if(get_user === "[x] Error, No user found!") {
        return false;
    } else {
        return true;
    }
}

/*
*@param: discord_id
*@type [<boolean>]
*/
exports.isPremium = function(userid) {
    let prm_stats = Crud.User(userid).split(",")[2];
    if(parseInt(prm_stats) > 0 && parseInt(prm_stats) <= 5) {
        return true;
    } else {
        return false;
    }
}

/*
*@param: discord_id
*@type [<boolen>]
*/
exports.isAdmin = function(userid) {
    let admin = Crud.User(userid).split(",")[4];
    if(parseInt(admin) === 1 || parseInt(admin) === "1") {
        return true;
    } else {
        return false;
    }
}

/*
*@param: discord_id
*@type [<boolen>]
*/
exports.TimeValidation = function(userid, boot_time) {
    let max_time = Crud.User(userid).split(",")[3];
    if(parseInt(boot_time) <= parseInt(max_time)) {
        return true;
    } else {
        return false;
    }
}

/*
*@param: discord_id
*@type [<string>]
*/
exports.Userstats = function(userid) {
    let get_user = Crud.User(userid).split(",");
    let admin = get_user[4] == 1 ? true:false;
    let reply = "User: " + get_user[0] + " | UserID: " + get_user[1] + "\nLevel: " + get_user[2] + " | Max time: " + get_user[3] + " | Admin: " + admin;    
    return reply;
}

/*
*@type [<int>]
*/
exports.MemberCount = function() {
    return fs.readFileSync("./db/users.db", "utf8").split("\n").length-1;
}

/*
*@type [<int>]
*/
exports.PremiumCount = function() {
    let db = fs.readFileSync("./db/users.db", "utf8");
    let users = db.split("\n");

    let premium_users = 0;

    users.forEach(e => {
        if(e.length > 5) {
            let split_info = e.split("','");
            if(parseInt(split_info[2]) > 0 || parseInt(split_info[2] <= 5)) {
                premium_users++;
            }
        }
    })

    return premium_users;
}

/*
*@type [<int>]
*/
exports.AdminCount = function() {
    let db = fs.readFileSync("./db/users.db", "utf8");
    let users = db.split("\n");
    users.forEach(e => {
        if(e.length > 5) {
            let admin_check = e.split(",")[4];
        }
    })
}
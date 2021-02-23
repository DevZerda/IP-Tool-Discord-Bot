// Modules
const fs = require("fs");

// File
const Config = require("../Config/main.js");
const Crud = require("./crud.js");

/*
*@param: discord_id
*@type: [<string>]
*/
exports.User = function(userid) {
    let found_check = false
    let user_info = "";

    let db = fs.readFileSync("./db/users.db", "utf8");
    let fix = db.split("('").join("");
    let fix2 = fix.split("')").join("");
    let users = fix2.split("\n");
    users.forEach(e => {
        if(e.length > 5) {
            if(e.includes(userid)) {
                found_check = true;
                user_info = e.split("','").join(",");
            }
        }
    })

    if(found_check == false) {
        return "[x] Error, No user found!";
    } else {
        return user_info;
    }
}

/*
*@param, discord_nametag, discord_id
*@type [<string>]
*/
exports.userAdd = function(user, userid) {
    if(user.length === 0 || userid.length === 0) {
        return "[x] Error, Invalid arguments values!";
    }

    let check_user = Crud.User(user);
    if(check_user === "[x] Error, No user found!") {
        fs.appendFileSync("./db/users.db", "('" + user + "','" + userid + "','0','0','0')\n");
        return "User: <@" + userid + "> successfully added!";
    } else {
        return "[x] Error, Username is already registered.";
    }
}

/*
*@param: discord_id
*@type [<string>]
*/
exports.userRemove = function(userid) {
    if(userid.length === 0) {
        return "[x] Error, No user set to remove!";
    }
    let db = fs.readFileSync("./db/users.db", "utf8");
    let users = db.split("\n");

    let new_db = "";

    users.forEach(e => {
        if(e.length > 5) {
            if(e.includes(user)) {

            } else {
                new_db += e + "\n";
            }
        }
    })

    fs.writeFileSync("./db/users.db", new_db);
    return "User: <@" + userid + "> successfully removed";
}

/*
*@param: discord_id, new_level(0-5), max_time(0-10000), new_admin(0/1)
*@type [<string>]
*/
exports.userUpdate = function(userid, lvl, mtime, admin) {
    let old_db = fs.readFileSync("./db/users.db", "utf8");
    let fix = old_db.split("('").join("");
    let fix2 = fix.split("')").join("");
    let old_usr = fix2.split("\n");

    let found_check = false;
    new_db = "";

    old_usr.forEach(e => {
        if(e.length > 5) {
            if(e.includes(user)) {
                let info = e.split("','");
                found_check = true;
                db_usr = info[0];
                db_ip = info[1];
                db_pw = info[2];
                db_lvl = info[3];
                db_mtime = info[4];
                db_admin = info[5];
                new_db += "('" + user + "','" + ip + "','" + info[2] + "','" + lvl + "','" + mtime + "','" + admin + "')\n";
            } else {
                new_db += "('" + e + "')";
            }
        }
    })

    return "User: <@" + userid + "> successfully updated!";
}
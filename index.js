/*
*@title: Pandemic Bot
*@since: 2/21/2021
*@creator: n4n0
*/

// Modules
const Discord = require("discord.js");
const Fetch = require("node-fetch");
const fs = require("fs");

// Files
const Config = require("./Config/main.js");
const C = require("./Config/current.js");
const Crud = require("./Auth/crud.js");
const eCrud = require("./Auth/functions.js");
const Extra = require("./Extra/functions.js");

// Extra Const/Vars Etc
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const Client = new Discord.Client();


Client.on('ready', () => {
    console.log(`Logged in as ${Client.user.tag}!\nServer Count: ${Client.guilds.cache.size}`);
    Client.user.setActivity(Config.Info.Prefix + "info to start!");
    
});


Client.on('message', async (msg) => {

    if(msg.author.bot) return;
    C.CurrentCmd.fullcmd = msg.content;
    
    C.CurrentUser.Name = msg.author.tag;
    C.CurrentUser.UserID = msg.author.id;

    C.CurrentRoom.Server = msg.guild.name;
    C.CurrentRoom.ServerID = msg.guild.id;
    C.CurrentRoom.Channel = msg.channel.name;
    C.CurrentRoom.ChannelID = msg.channel.id;

    
    Config.GetMsg(msg.content);
    

    /*
                        COMMAND HANDLER
    */
    
    if(C.CurrentCmd.Cmd === Config.Info.Prefix + "register") { 
        sendmsg("Register", Crud.userAdd(C.CurrentUser.Name, C.CurrentUser.UserID));
    } else if(eCrud.isRegistered(msg.author.id) && C.CurrentCmd.Cmd.startsWith(Config.Info.Prefix)) { // Register check
        Extra.log_console("CMD");
        if(C.CurrentCmd.Cmd === Config.Info.Prefix + "info") {
            info_embed();
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "help") {
            help_embed();
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "myinfo") {
            sendmsg("My Info", "```" + eCrud.Userstats(C.CurrentUser.UserID) + "```");
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "geo") {
            if(C.CurrentCmd.argCount === 1) {
                await geoResults(C.CurrentCmd.arg[1]);
            } else {
                sendmsg("Error", "Invalid argument\nUsage: " + Config.Info.Prefix + "geo <ip>");
            }
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "botinv") {
            sendmsg("Bot Invite", "Spread the bot around!. " + Config.Info.Botinv);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "serverinv") {
            sendmsg("Server Invite", Config.Info.ServerInv);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "site") {
            sendmsg("Site", Config.Info.Site);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "methods") {
            sendmsg("Methods", "UDP\nTCP\nSTD")
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "wipe") {
            if(eCrud.isAdmin(C.CurrentUser.UserID)) {
                if(C.CurrentCmd.argCount === 1) {
                    if(C.CurrentCmd.arg[1] <= 1000) {
                        let msg_c = C.CurrentCmd.arg[1];
                        let n = 0;
                        let c_s = true;
                        while(c_s) {
                            let left_over = parseInt(msg_c) - n;
                            if(left_over <= 100) {
                                msg.channel.bulkDelete(left_over);
                                c_s = false;
                            } else {
                                msg.channel.bulkDelete(100);
                            }
                            n+=100;
                        }
                    } else {
                        sendmsg("Error", "Invalid message amount. Max is 1000!")
                    }
                } else {
                    sendmsg("Error", "Invalid argument\n Usage: " + Config.Info.Prefix + "wipe <amount>");
                }
            } else {
                sendmsg("Error", "You aren't admin to use this command!");
            }
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "stress") {
            if(C.CurrentCmd.arg.length > 3) {
                if(eCrud.isPremium(C.CurrentUser.UserID) || eCrud.isAdmin(C.CurrentUser.UserID)) {
                    Extra.send_attack(C.CurrentCmd.arg[1], C.CurrentCmd.arg[2], C.CurrentCmd.arg[3], C.CurrentCmd.arg[4]);
                    bootembed(C.CurrentCmd.arg[1], C.CurrentCmd.arg[2], C.CurrentCmd.arg[3], C.CurrentCmd.arg[4], Extra.currentTime());
                } else {
                    sendmsg("Error", "You do not have premium to use this command!");
                }
            } else {
                sendmsg("Error", "Invalid arguments\nUsage: " + Config.Info.Prefix + "stress <ip> <port> <time> <method>");
            }
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "admin") {
            let tool = C.CurrentCmd.arg[1];
            if(eCrud.isAdmin(C.CurrentUser.UserID)) {
                if(tool == "servers") {
                    let test = await servers();
                    sendmsg("List of servers im in", "```" + test + "```");
                } else if(tool == "server_invites") {
                    let fag = "";
                    Client.guilds.cache.forEach(guild => {
                        guild.channels.cache.filter(x => x.type != "category").random().createInvite()
                          .then(inv => console.log(guild.name + " | " + inv.url) );
                    });
                    console.log("\r\n");
                    sendmsg("Invites", "Invites sent to console!");
                } else if(tool == "search_user") {
                    sendmsg("My Info", "```" + eCrud.Userstats(C.CurrentCmd.arg[2]) + "```");
                } else if(tool == "update_user") {
                    if(C.CurrentCmd.argCount === 5) {
                        sendmsg("Update Status", Crud.userUpdate(C.CurrentCmd.arg[2], C.CurrentCmd.arg[3], C.CurrentCmd.arg[4], C.CurrentCmd.arg[5]))
                    } else {
                        sendmsg("Error", "Invalid arguments\nUsage: " + Config.Info.Prefix + "admin search_user <User_To_Update> <new lvl> <new maxtime> <new admin>");
                    }
                } else {
                    adminhelp_embed();
                }
            } else {
                sendmsg("Error", "You aren't admin to use this command");
            }
        } else {
            sendmsg("Error", "That wasn't a command on the bot. type " + Config.Info.Prefix + "help for a list of commands!");
        }
    } else if(C.CurrentCmd.Cmd.startsWith(Config.Info.Prefix)) {
        sendmsg("Error", "You aren't registered to use this bot!. Type ``" + Config.Info.Prefix + "register`` to use the bot!");
    } else {
        Extra.log_console("MSG");
    }

    /*
                        EXTRA FUNCTIONS
    */
    
    /*
    *@param: Title, Description
    *@type: (void)
    */
    function sendmsg(title, desc) {
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#ff0000')
	        .setTitle(Config.Info.Title + " | " + title)
	        .setDescription(desc)
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

    /*
    *@type: (void)
    */
    function info_embed() {
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#ff0000')
	        .setTitle(Config.Info.Title + " | Info")
	        .setDescription('Welcome To Pandemic\'s Bot')
	        .addFields(
		        { name: 'Total Members', value: eCrud.MemberCount(), inline: true },
		        { name: 'Total Premium Members', value: eCrud.PremiumCount(), inline: true },
		        { name: 'Total APIs', value: '2', inline: true},
		        { name: 'Bot Server Count', value: Client.guilds.cache.size, inline: true },
		        { name: 'Bot Creator', value: 'n4n0#2100', inline: true },
		        { name: 'Bot Owner', value: 'Lux#1834', inline: true }
	        ) 
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

    /*
    *@type: (void)
    */
    function help_embed() {
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#ff0000')
	        .setTitle(Config.Info.Title + " | Help")
	        .setDescription('Command Info\nCommand Usage')
	        .addFields(
		        { name: 'Info | Bot Info', value: Config.Info.Prefix + 'info' },
		        { name: 'Help | Command list', value: Config.Info.Prefix + 'help'},
		        { name: 'Bot Invite | Invite the bot to your server', value: Config.Info.Prefix + 'botinv'},
		        { name: 'Server Invite | Invite to the main server', value: Config.Info.Prefix + 'serverinv'},
		        { name: 'Site | Main web site to Pandemic', value: Config.Info.Prefix + 'site'},
		        { name: 'My Info | My Statistics', value: Config.Info.Prefix + 'myinfo'},
		        { name: 'Methods | List of methods', value: Config.Info.Prefix + 'methods'},
		        { name: 'GeoIP | Geo locate an IP', value: Config.Info.Prefix + 'geoip <ip>'},
		        { name: 'Port Scan | Port Scan a IP', value: Config.Info.Prefix + 'scan <ip>' },
		        { name: 'Stresser | Smack a IP offline', value: Config.Info.Prefix + 'stress <ip> <port> <time> <method>'},
		        { name: 'Admin | Admins only', value: Config.Info.Prefix + 'admin'}
	        )
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

    /*
    *@type: (void)
    */
    function adminhelp_embed() {
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#ff0000')
	        .setTitle(Config.Info.Title + " | Help")
	        .setDescription('Command Info\nCommand Usage')
	        .addFields(
		        { name: 'Help | List of commands', value: Config.Info.Prefix + 'admin' },
		        { name: 'Servers | List of server the bot is in', value: Config.Info.Prefix + 'admin servers'},
		        { name: 'Invites | List of servers + invite', value: Config.Info.Prefix + 'admin server_invites'},
		        { name: 'Servers | List of server the bot is in', value: Config.Info.Prefix + 'admin servers'},
	        )
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

    /*
    *@param: IP Address
    *@type: (void)
    */
    async function geoResults(ip) {
        let gg = await Extra.geoIP(ip);

        let geo_info = gg.split("\n");
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle(Config.Info.Title + " | Geo Results")
          .addFields(
              // { name: 'Regular field title', value: 'Some value here' },
              // { name: '\u200B', value: '\u200B' },
              { name: 'Status', value: geo_info[0], inline: true },
              { name: 'Country', value: geo_info[1], inline: true },
              { name: 'Country US', value: geo_info[2], inline: true },
              { name: 'Region', value: geo_info[3], inline: true },
              { name: 'RegionName', value: geo_info[4], inline: true },
              { name: 'City', value: geo_info[5], inline: true },
              { name: 'Zip', value: geo_info[6], inline: true },
              { name: 'Lat', value: geo_info[7], inline: true },
              { name: 'Lon', value: geo_info[8], inline: true },
              { name: 'Timezone', value: geo_info[9], inline: true },
              { name: 'ISP', value: geo_info[10], inline: true },
          )
          .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
  
      msg.channel.send(exampleEmbed);
    }

    /*
    *@param: IP Address, Port, Time, Method, Timestamp
    *@type: (void)
    */
    function bootembed(ip, p, t, m, timestamp) {
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle(Config.Info.Title + " | Attack Status")
          .addFields(
              // { name: 'Regular field title', value: 'Some value here' },
              // { name: '\u200B', value: '\u200B' },
              { name: 'IP', value: ip, inline: true },
              { name: 'Port', value: p, inline: true },
              { name: 'Time', value: t, inline: true },
              { name: 'Method', value: m, inline: true },
              { name: 'Status', value: "True", inline: true },
              { name: 'Timestamp', value: timestamp, inline: true }
          )
          .setImage('https://media1.giphy.com/media/lp7MBJt51Sb49gGLqD/giphy.gif')
          .setTimestamp()
          .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
  
      msg.channel.send(exampleEmbed);
    }

    /*
    *@type: (Promise[<string>])
    */
    async function servers() {
        let list = "";
        await Client.guilds.cache.forEach(guild => {
            list += `${guild.name} | ${guild.id}` + "\n";
        })
        return list;
    }

    /*
    *@param: Server Name
    *@type: (Promise[<string>])
    */
    async function get_server_id(server_name) {
        let list = "";
        await Client.guilds.cache.forEach(guild => {
            if(guild.name === server_name) {
                list += guild.id;
            }
        })
        return list;
    }

})

Client.login(Config.Info.Token);
  
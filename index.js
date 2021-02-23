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
const { config } = require("process");

// Extra Const/Vars Etc
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const Client = new Discord.Client();


Client.on('ready', () => {
    console.log(`Logged in as ${Client.user.tag}!\nServer Count: ${Client.guilds.cache.size}`);
    Client.user.setActivity(Config.Info.Prefix + "help to start!");
    // Client.user.setPresence({ game: { name: `the bot is working`, type: 'WATCHING' }, status: 'online' });
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
        if(C.CurrentCmd.Cmd === Config.Info.Prefix + "info") {
            info_embed();
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "help") {
            help_embed();
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "myinfo") {
            sendmsg("My Info", "```" + eCrud.Userstats(C.CurrentUser.UserID) + "```");
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "geo") {
            let test = await Extra.geoIP(C.CurrentCmd.arg[1]);
            sendmsg("Geo Results", test);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "botinv") {
            sendmsg("Bot Invite", "Spread the bot around!. " + Config.Info.Botinv);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "serverinv") {
            sendmsg("Server Invite", Config.Info.ServerInv);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "site") {
            sendmsg("Site", Config.Info.Site);
        } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "stress") {
            // sendmsg("Stress Status", "Attack sent to " + C.CurrentCmd.arg[1] + ":" + C.CurrentCmd.arg[2] + " for " + C.CurrentCmd.arg[3] + " seconds with " + C.CurrentCmd.arg[4]);
            let api_resp = Extra.send_attack(C.CurrentCmd.arg[1], C.CurrentCmd.arg[2], C.CurrentCmd.arg[3], C.CurrentCmd.arg[4]);
            if(api_resp.toLowerCase().includes("attack sent")) {
                bootembed(C.CurrentCmd.arg[1], C.CurrentCmd.arg[2], C.CurrentCmd.arg[3], C.CurrentCmd.arg[4], Extra.currentTime());
            } else {
                sendmsg("Error", "Something went wrong sending attack (An admin must check backend)")
            }
        // } else if(C.CurrentCmd.Cmd === Config.Info.Prefix + "") {

        } else {
            sendmsg("Error", "That wasn't a command on the bot. type " + Config.Info.Prefix + "help for a list of commands!");
        }
        Extra.log_console("CMD");
    } else if(C.CurrentCmd.Cmd.startsWith(Config.Info.Prefix)) {
        sendmsg("Error", "You aren't registered to use this bot!. Type ``" + Config.Info.Prefix + "register`` to use the bot!");
    } else {
        Extra.log_console("MSG");
    }

    /*
                        EXTRA FUNCTIONS
    */

    function sendmsg(title, desc) {
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#ff0000')
	        .setTitle(Config.Info.Title + " | " + title)
	        .setDescription(desc)
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

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
		        { name: 'GeoIP | Geo locate an IP', value: Config.Info.Prefix + 'geoip <ip>'},
		        { name: 'Port Scan | Port Scan a IP', value: Config.Info.Prefix + 'scan <ip>' },
		        { name: 'Stresser | Smack a IP offline', value: Config.Info.Prefix + 'stress <ip> <port> <time> <method>'},
		        { name: 'Admin | Admins only', value: Config.Info.Prefix + 'admin'}
	        )
	        .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
            msg.channel.send(exampleEmbed);
    }

    function bootembed(ip, p, t, m, status, timestamp) {
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle(Config.Info,Title + " | Attack Status")
          .addFields(
              // { name: 'Regular field title', value: 'Some value here' },
              // { name: '\u200B', value: '\u200B' },
              { name: 'IP', value: ip, inline: true },
              { name: 'Port', value: p, inline: true },
              { name: 'Time', value: t, inline: true },
              { name: 'Method', value: m, inline: true },
              { name: 'Status', value: "True", inline: true },
              { name: 'Timestamp', value: timestamp, inline: true },
          )
          .setImage('https://media1.giphy.com/media/lp7MBJt51Sb49gGLqD/giphy.gif')
          .setTimestamp()
          .setFooter('Created/Developed By ' + Config.Info.Creator + ' | Headquarter Server: ' + Config.Info.ServerInv, ' ');
  
      message.channel.send(exampleEmbed);
    }
})

Client.login(Config.Info.Token);
  
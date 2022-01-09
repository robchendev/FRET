const Discord = require("discord.js");
const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
});
const ids = require(`./config.json`);
var tools = require(`./tools/functions.js`);
const prefix = ids.userPrefix;
const prefixMod = ids.moderatorPrefix;
var serverID = "";
const fs = require("fs");
const cron = require("node-cron");
bot.commands = new Discord.Collection();

// Discover commands.
const commandHandler = require(`./handlers/commandHandler.js`);

console.log("Discovering commands.");
commandHandler.discover();

console.log("Registering slash commands.");
commandHandler.registerCommands(bot);

// console.log("Restricting moderator slash commands.");
// commandHandler.restrictModeratorCommands(bot);

let usedThanksRecently = new Set();

// Live '59 23 * * Sun' - Runs every week at Sunday 11:59 PM EST
// Test '* * * * *' - Runs every minute
cron.schedule("59 23 * * Sun", function () {
    bot.commands.get("weeklyCron").execute(bot);
});

const clientHandler = require(`./handlers/clientHandler.js`);
bot.once("ready", clientHandler.ready);
bot.on("guildCreate", clientHandler.joinGuild);
bot.on("guildDelete", clientHandler.leaveGuild);
bot.on("interactionCreate", async interaction => clientHandler.processInteraction(bot, interaction));

bot.on("messageCreate", async (msg) => {
    // If user DMs, do nothing
    if (msg.channel.type == "dm") {
        return;
    } else {
        serverID = msg.guild.id;

        //Monitors #share-your-music channel only and creates threads for it
        if (msg.channel.id === ids.shareMusicChannel && !msg.author.bot) {
            bot.commands.get("shareYourMusic").execute(prefixMod, msg);
        }

        //Monitors #help-forum channel only and creates threads for it
        else if (msg.channel.id === ids.helpForumChannel && !msg.author.bot) {
            bot.commands.get("forum").execute(prefix, prefixMod, msg);
        }

        else if (msg.channel.id === ids.impersonateChannel && !msg.author.bot) {
            bot.commands.get("impersonate").execute(bot, msg);
        }

        //When message doesnt start with '-', '+' or author is bot
        else if (
            (!msg.content.startsWith(prefix) &&
                !msg.content.startsWith(prefixMod)) ||
            msg.author.bot
        ) {
            return;
        }

        //user commands
        if (msg.content.startsWith(prefix) && !msg.author.bot) {
            //Splices via space (ie "-thanks @robert")
            const withoutPrefix = msg.content.slice(prefix.length);
            const split = withoutPrefix.split(/ +/);
            const command = split[0];
            const args = split.slice(1);

            //Reads commands and does stuff
            switch (command) {
                case "thank":
                case "thanks":
                    if (usedThanksRecently.has(msg.author.id)) {
                        tools.cooldownReminder("thank", 1, msg);
                    } else {
                        bot.commands.get("thanks").execute(prefix, msg, args);
                        usedThanksRecently = tools.setCooldown(1, msg);
                    }
                    break;
                case "rankup":
                    bot.commands.get("rankup").execute(msg);
                    break;
                case "points":
                    bot.commands.get("points").execute(prefix, msg, args);
                    break;
                case "w":
                    // Will only work when used in weekly
                    if (msg.channel.id === ids.weeklyChannel) {
                        bot.commands
                            .get("weekly")
                            .execute(bot, prefix, msg, args);
                    }
                    break;
                case "help":
                    bot.commands.get("help").execute(bot, prefix, msg, args);
                    break;
                case "contribute":
                    bot.commands.get("contribute").execute(msg);
            }
        } else if (msg.content.startsWith(prefixMod) && !msg.author.bot) {
            if (msg.member.roles.cache.has(ids.DBmanager)) {
                //Splices via space (ie "+thanks @robert")
                const withoutPrefix = msg.content.slice(prefixMod.length);
                const split = withoutPrefix.split(/ +/);
                const command = split[0];
                const args = split.slice(1);

                //Reads commands and does stuff
                switch (command) {
                    case "ping":
                        msg.channel.send(`${ids.botName} is online`);
                        break;
                    case "penalty": bot.commands.get("Penalty").execute(prefixMod, msg, args); break;
                    case "points":
                        bot.commands
                            .get("pointsMod")
                            .execute(prefixMod, msg, args);
                        break;
                    case "w":
                        bot.commands
                            .get("weeklyMod")
                            .execute(bot, prefixMod, msg, args);
                        break;
                    case "help":
                        bot.commands.get("helpMod").execute(prefixMod, msg);
                        break;
                }
            } else {
                msg.channel.send("You are not permitted to use that command");
            }
        }
    }
});

//keep this at the last line of the file
const configHandler = require(`./handlers/configurationHandler.js`);
bot.login(configHandler.secrets.Token);
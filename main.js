const Discord = require("discord.js");
const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
});
const secrets = require(`./secrets.json`);
const ids = require(`./config.json`);
var tools = require(`./tools/functions.js`);
const prefix = ids.userPrefix;
const prefixMod = ids.moderatorPrefix;
var serverID = "";
const fs = require("fs");
const cron = require("node-cron");
bot.commands = new Discord.Collection();

// Load commands through the directory handler.
const directoryHandler = require(`./handlers/directoryHandler.js`);
const commandFiles = directoryHandler.loadFilesRecursive(`commands`);
for (const file of commandFiles) {
    const command = require(`./${file}`);

    // Not all commands have this ability yet. Provide a warning for those who fail.
    try {
        command.registerWithHandlers();
    } catch (error) {
        console.warn(`Unable to regiser ${command.name} with handlers.`);
    }

    bot.commands.set(command.name, command);
}
let usedThanksRecently = new Set();

// Live '59 23 * * Sun' - Runs every week at Sunday 11:59 PM EST
// Test '* * * * *' - Runs every minute
cron.schedule("59 23 * * Sun", function () {
    bot.commands.get("weeklyCron").execute(bot);
});

bot.once("ready", () => {
    console.log("F.R.E.T. started");
});

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
bot.login(secrets.Token);
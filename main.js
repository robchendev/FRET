const Discord = require("discord.js");
const bot = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"],
});

// Load configurations.
const configHandler = require(`./handlers/configurationHandler.js`);
configHandler.initialize();

var tools = require(`./tools/functions.js`);
const prefix = configHandler.data.userPrefix;
const prefixMod = configHandler.data.moderatorPrefix;
var serverID = "";
const fs = require("fs");
const cron = require("node-cron");
bot.commands = new Discord.Collection();

// Discover commands.
const commandHandler = require(`./handlers/commandHandler.js`);

console.log("Discovering commands.");
commandHandler.discover();

console.log("Registering commands.");
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
bot.on("interactionCreate", async (interaction) =>
  clientHandler.processInteraction(bot, interaction)
);

// bot.on("interactionCreate", async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;
//   console.log("interaction!");
//   if (interaction.commandName === "bounty") {
//     console.log("here!");
//     await interaction.reply({
//       content: "Bounty Interaction!",
//       ephemeral: true,
//     });
//   }
// });

bot.on("threadCreate", function (thread) {
  if (thread.parentId === configHandler.flux.helpForumChannel) {
    bot.commands.get("forum").execute(thread);
  }
});

bot.on("messageCreate", async (msg) => {
  // If user DMs, do nothing
  if (msg.channel.type == "dm") {
    return;
  } else {
    serverID = msg.guild.id;

    //Monitors #share-your-music channel only and creates threads for it
    if (
      msg.channel.id === configHandler.flux.shareMusicChannel &&
      !msg.author.bot
    ) {
      bot.commands.get("shareYourMusic").execute(prefixMod, msg);
    }

    //Monitors competitions channel only and creates threads for it
    else if (
      msg.channel.id === configHandler.flux.competitionChannel &&
      !msg.author.bot
    ) {
      bot.commands.get("competition").execute(prefix, prefixMod, msg);
    }

    //Monitors #weekly-submission channel only and creates threads for it
    else if (
      msg.channel.id === configHandler.flux.weeklyChannel &&
      !msg.author.bot
    ) {
      bot.commands.get("weekly").execute(bot, prefix, prefixMod, msg);
    }

    //Monitors #impersonate channel only
    else if (
      msg.channel.id === configHandler.flux.impersonateChannel &&
      !msg.author.bot &&
      msg.member.roles.cache.has(configHandler.flux.DBmanager)
    ) {
      bot.commands.get("impersonate").execute(bot, msg);
    }

    //When message doesnt start with '-', '+' or author is bot
    else if (
      (!msg.content.startsWith(prefix) && !msg.content.startsWith(prefixMod)) ||
      msg.author.bot
    ) {
      return;
    }

    //user commands
    if (msg.content.startsWith(prefix) && !msg.author.bot) {
      //Splices via space (ie "-thanks @robert") and replaces newlines with space
      const withoutPrefix = msg.content
        .replace(/\n/g, " ")
        .slice(prefix.length);
      const split = withoutPrefix.split(/ +/);
      const command = split[0];
      const args = split.slice(1);

      //Reads commands and does stuff
      switch (command) {
        case "thank":
        case "thanks":
          bot.commands.get("thanks").execute(prefix, msg, args);
          break;
        case "rankup":
          bot.commands.get("rankup").execute(msg);
          break;
        case "points":
          bot.commands.get("points").execute(prefix, msg, args);
          break;
        case "help":
          bot.commands.get("help").execute(bot, prefix, msg, args);
          break;
        case "contribute":
          bot.commands.get("contribute").execute(msg);
          break;
        case "top":
        case "leaderboard":
          // the top/leaderboard command will not work in
          // these channels but will still work in child
          // threads of these channels
          if (
            msg.channel !== configHandler.flux.weeklyChannel ||
            msg.channel !== configHandler.flux.shareMusicChannel ||
            msg.channel !== configHandler.flux.helpForumChannel
          ) {
            bot.commands.get("leaderboard").execute(bot, msg, args);
          }
          break;
        case "pin":
          bot.commands.get("pin").execute(msg);
      }
    } else if (msg.content.startsWith(prefixMod) && !msg.author.bot) {
      if (msg.member.roles.cache.has(configHandler.flux.DBmanager)) {
        //Splices via space (ie "+thanks @robert")
        const withoutPrefix = msg.content.slice(prefixMod.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);

        //Reads commands and does stuff
        switch (command) {
          case "ping":
            msg.channel.send(`${configHandler.data.botName} is online`);
            break;
          case "penalty":
            bot.commands.get("Penalty").execute(prefixMod, msg, args);
            break;
          case "points":
            bot.commands.get("pointsMod").execute(prefixMod, msg, args);
            break;
          case "w":
            bot.commands.get("weeklyMod").execute(bot, prefixMod, msg, args);
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
bot.login(configHandler.secrets.Token);

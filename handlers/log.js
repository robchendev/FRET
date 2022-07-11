const Discord = require("discord.js");
const configHandler = require(`./configurationHandler.js`);
configHandler.initialize();

function log(msg, priority) {
  const errLogChannel = bot.channels.cache.get(configHandler.flux.logChannel);
  errLogChannel.send(`${priority} ${msg}`);
}

function manualLog(msg) {}

module.exports = {
  name: "log",
  description: "logs errors to a pre-configured channel",
  err(msg) {
    log(msg, ":green_circle:");
  },
  info(msg) {
    log(msg, ":red_circle:");
  },
};

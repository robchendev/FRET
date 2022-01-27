const Discord = require("discord.js");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();

var tools = require(`../../tools/functions.js`);

/**
 * Displays a list of moderator commands
 * @param {String} prefix - the user prefix
 * @param {Message} msg - the original message 
 */
function showModCommands(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .setTitle("Moderator Commands")
        .addField(
            `\`${prefix}points inc|dec|set <user> <points>\``,
            "Increases, descreases or sets user's points",
            false
        )
        .addField(
            `\`${prefix}points pen <user>\``,
            "Penalizes user for 1000 points",
            false
        )
        .addField(
            `\`${prefix}w invalidate <user>\``,
            "Invalidates user's submission this week",
            false
        )
        .addField(
            `\`${prefix}w setstreak <user> <streaks>\``,
            "Sets a user's weekly submission streak",
            false
        )
        .addField(
            `\`${prefix}w reset <user>\``,
            "Resets user's weekly streak and rank",
            false
        );
    msg.channel.send({ embeds: [embedMsg] })
    .then((sentMsg) => {
        tools.deleteMsg(sentMsg, 10);
        tools.deleteMsg(msg, 10);
    })
    .catch();;
}

module.exports = {
    name: "helpMod",
    description: "this command shows an embed for moderator commands",
    execute(prefix, msg) {
        showModCommands(prefix, msg);
    },
};

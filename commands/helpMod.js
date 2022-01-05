const Discord = require("discord.js");
const ids = require(`../ids.json`);

function showModCommands(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(ids.transparentColor)
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
    msg.channel.send({ embeds: [embedMsg] });
}

module.exports = {
    name: "helpMod",
    description: "this command shows an embed for moderator commands",
    execute(prefix, msg) {
        showModCommands(prefix, msg);
    },
};

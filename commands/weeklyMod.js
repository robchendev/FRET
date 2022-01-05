const Discord = require("discord.js");
const mongoose = require("mongoose");
const ids = require(`../ids.json`);
const updateWeekly = require("../models/weeklyUpdate.js");
const secrets = require(`../secrets.json`);
var tools = require(`../tools/functions.js`);
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Resets streak to 0 and removes role
 * @param {Array} msg - point thresholds for each role
 * @param {Array} roleNames - roles to be given
 */
function resetProfile(msg, thisUser, roleNames) {
    updateWeekly.findOne({ userid: thisUser.id }, (err, submitdata) => {
        if (err) console.log(err);
        if (!submitdata) {
            msg.channel.send(
                `**${thisUser.user.username}** does not have a profile.`
            );
        } else {
            resetStreak(submitdata);
            removeRoles(msg, roleNames);
            const embedMsg = new Discord.MessageEmbed()
                .setColor(ids.dataChangeColor)
                .setDescription(
                    `${thisUser}'s streaks and rank have been reset.`
                );
            msg.channel.send({ embeds: [embedMsg] });
        }
    });
}

/**
 * Removes all roles in roleNames from the user
 * @param {Array} msg - point thresholds for each role
 * @param {Array} roleNames - roles to be given
 */
function removeRoles(msg, roleNames) {
    // retrieve member object for user
    let user = msg.mentions.members.first();
    if (msg != undefined) {
        for (var i = 0; i < roleNames.length; i++) {
            if (user.roles.cache.has(roleNames[i].id)) {
                user.roles.remove(roleNames[i].id);
            }
        }
    }
}

/**
 * Resets streak count of data to 0
 * @param {Schema} submitdata - holds submission data
 */
function resetStreak(submitdata) {
    submitdata.streak = 0;
}

/**
 * Deletes message and sends a disappearing message telling user how to use the command
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(ids.incorrectUsageColor)
        .addField(
            `\`${prefix}w reset <user>\``,
            "Reset streak and rank",
            false
        );
    msg.channel
        .send({ embeds: [embedMsg] })
        .then((sentMsg) => {
            tools.deleteMsg(sentMsg, 10);
            tools.deleteMsg(msg, 10);
        })
        .catch();
}

module.exports = {
    name: "weeklyMod",
    description: "this command submits an entry to the weekly counter",
    execute(bot, prefix, msg, args) {
        // retrieves guild object
        let myGuild = bot.guilds.cache.get(ids.serverGuild);

        // Weekly streak roles
        var roleNames = [
            /*0*/ myGuild.roles.cache.find((r) => r.name === ids.wRank1),
            /*1*/ myGuild.roles.cache.find((r) => r.name === ids.wRank2),
            /*2*/ myGuild.roles.cache.find((r) => r.name === ids.wRank3),
        ];

        // make sure passed arg is a mention, and that the first arg is 'reset'
        if (
            args.length === 2 &&
            args[1].startsWith("<@") &&
            args[1].endsWith(">") &&
            args[0] === "reset"
        ) {
            let thisUser = msg.mentions.members.first();
            resetProfile(msg, thisUser, roleNames);
        } else {
            incorrectUsage(prefix, msg);
        }
    },
};

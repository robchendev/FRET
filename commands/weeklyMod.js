const Discord = require("discord.js");
const mongoose = require("mongoose");
const ids = require(`../ids.json`);
const { update } = require("../models/weeklyUpdate.js");
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
 * @param {Member} thisUser - member object of the user to be reset
 * @param {Array} roleNames - roles to be given
 */
function resetProfile(msg, thisUser, roleNames) {
    updateWeekly.findOne({ userid: thisUser.id }, (err, submitdata) => {
        if (err) console.log(err);
        if (!submitdata) {
            msg.channel.send(
                `**${thisUser.user.username}** does not have a profile.`
            )
            .then((sentMsg) => {
                tools.deleteMsg(sentMsg, 10);
                tools.deleteMsg(msg, 10);
            });
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
 * sets thisWeek to undefined (as if the user didnt submit this week)
 * @param {Array} msg - point thresholds for each role
 * @param {Member} thisUser - member object of the user to be invalidated
 */
function invalidate(msg, thisUser) {
    updateWeekly.findOne({ userid: thisUser.id }, (err, submitdata) => {
        if (err) console.log(err);
        if (!submitdata) {
            msg.channel.send(
                `**${thisUser.user.username}** does not have a profile.`
            )
            .then((sentMsg) => {
                tools.deleteMsg(sentMsg, 15);
                tools.deleteMsg(msg, 15);
            });
        } 
        else if (submitdata.thisWeek === undefined) {
            msg.channel.send(
                `**${thisUser.user.username}** has not submitted this week.`
            )
            .then((sentMsg) => {
                tools.deleteMsg(sentMsg, 15);
                tools.deleteMsg(msg, 15);
            });
        }
        else {
            resetThisWeek(submitdata);
            msg.channel.send(`${thisUser}, your submission for this week has been invalidated. Please read <#${ids.weeklyGuideChannel}> and submit again with the correct criteria.`);
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
    submitdata.save().catch((err) => console.log(err));
}

/**
 * Resets thisWeek to undefined
 * @param {Schema} submitdata - holds submission data
 */
function resetThisWeek(submitdata) {
    submitdata.thisWeek = undefined;
    submitdata.save().catch((err) => console.log(err));
}

/**
 * Sets streak and updates highestStreak count
 * @param {Array} msg - point thresholds for each role
 * @param {Member} thisUser - member object of the user to be invalidated
 * @param {Number} newStreak - the new streak to be updated to
 */
function setStreak(msg, thisUser, newStreak) {
    updateWeekly.findOne({ userid: thisUser.id }, (err, submitdata) => {
        if (err) console.log(err);
        if (!submitdata) {
            msg.channel.send(
                `**${thisUser.user.username}** does not have a profile. They need to submit once to get one.`
            )
            .then((sentMsg) => {
                tools.deleteMsg(sentMsg, 10);
                tools.deleteMsg(msg, 10);
            });
        } else {
            updateStreak(submitdata, newStreak);
            const embedMsg = new Discord.MessageEmbed()
                .setColor(ids.dataChangeColor)
                .setDescription(
                    `${thisUser}'s streaks set to ${newStreak}. Last week set as submission date for finalization. Rank will be calculated at finalization. Make sure to submit this week.`
                );
            msg.channel.send({ embeds: [embedMsg] });
        }
    });
}

/**
 * Sets streak and updates highestStreak count
 * Also sets lastWeek to a date exactly one week before today to avoid
 * a bug that causes the user to permanently keep their streak
 * @param {Schema} submitdata - holds submission data
 * @param {Number} newStreak - the new streak to be updated to
 */
 function updateStreak(submitdata, newStreak) {
    submitdata.streak = newStreak;
    if (submitdata.highestStreak < newStreak) {
        submitdata.highestStreak = newStreak;
    }
    let today = new Date();
    let lastWeekDate = new Date();
    lastWeekDate.setDate(today.getDate() - 7);
    submitdata.lastWeek = lastWeekDate;
    submitdata.save().catch((err) => console.log(err));
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
        );;
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

        let thisUser = msg.mentions.members.first();

        
        if (thisUser !== undefined && args[1].startsWith("<@") && args[1].endsWith(">")){
            
            // +w reset <user>
            if (args.length === 2 && args[0] === "reset"){
                resetProfile(msg, thisUser, roleNames);
            }
            // +w invalidate <user>
            else if (args.length === 2 && args[0] === "invalidate"){
                invalidate(msg, thisUser);
            }
            // +w setstreak <user> <streak>
            else if (args.length === 3 && args[0] === "setstreak" && !isNaN(args[2])){
                setStreak(msg, thisUser, args[2]);
            }
            else {
                incorrectUsage(prefix, msg);
            }
        }
        else {
            incorrectUsage(prefix, msg);
        }
    },
};

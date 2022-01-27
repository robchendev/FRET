const Discord = require("discord.js");
const mongoose = require("mongoose");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();

const updateWeekly = require("../../models/weeklyUpdate.js");
var tools = require(`../../tools/functions.js`);
mongoose.connect(configHandler.secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Decides whether to send msg author's profile or mentioned user's profile.
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Message} msg - the original command message
 * @param {Array} args -
 */
function weeklyProfile(bot, msg, args) {
    // -w profile @user
    if (
        args.length === 2 &&
        args[1].startsWith("<@") &&
        args[1].endsWith(">")
    ) {
        let thisUser = msg.mentions.members.first();
        makeProfile(bot, msg, thisUser);
    }
    // -w profile
    else {
        //msg.member (guildmember) is the same as msg.author (user)
        let thisUser = msg.member;
        makeProfile(bot, msg, thisUser);
    }
}

/**
 * Updates user data by logged date submitted this week
 * @param {Message} msg - the original command message
 */
function updateProfile(msg) {
    let dateToday = new Date();
    updateWeekly.findOne({ userid: msg.author.id }, (err, submitdata) => {
        if (err) console.log(err);
        if (!submitdata) {
            tools.createWeeklydata(updateWeekly, msg.author.id, dateToday);
        } else {
            tools.updateWeeklydata(submitdata, dateToday);
        }
    });
    msg.react("✅");
}

/**
 * Submits weekly as long as it's an attachment or link.
 * @param {Message} msg - the original command message
 */
function weeklySubmit(msg) {
    let hasAttach = msg.attachments.size > 0;
    let hasLink = msg.content.includes(
        "https://" || "http://" || "youtube.com" || "youtu.be"
    );

    // message is valid (contains attachment or link)
    if (hasAttach || hasLink) {
        updateProfile(msg);
    }

    // When the message does not contain and attachment nor link
    else {
        incorrectSubmit(msg);
    }
}

/**
 * Sends embed message showing current time, deadline
 * and time remaining before deadline
 * @param {Message} msg - the original command message
 */
function weeklyInfo(msg) {
    // Current time
    let dateToday = new Date();
    let datetimeToday = dateTimeString(dateToday);

    // This week's deadline
    let deadline = setDeadline(dateToday, 0);
    deadline.setHours(23, 59);
    let datetimeDeadline = dateTimeString(deadline);

    // how many seconds before deadline
    let timeLeft = (deadline.getTime() - dateToday.getTime()) / 1000;

    // send embedded msg with all the date / time info.
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .addField(`Current time`, `${datetimeToday}`, false)
        .addField(`Next finalization`, `${datetimeDeadline}`, false)
        .addField(`Time remaining`, `${secondsToDHM(timeLeft)}`, false);
    msg.channel.send({ embeds: [embedMsg] });
}

/**
 * Makes and sends the user profile. Shows error message if user has no data.
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Message} msg - the original command message
 * @param {User} thisUser - the user object of the role to retrieve
 */
function makeProfile(bot, msg, thisUser) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.thanksColor)
        .setAuthor({
            name: `Profile for ${thisUser.user.username}`,
        })
        .setThumbnail(thisUser.user.avatarURL());

    updateWeekly.findOne({ userid: thisUser.id }, (err, submitdata) => {
        if (err) console.log(err);

        if (!submitdata) {
            msg.channel.send(
                `**${thisUser.user.username}** does not have a profile! They will get one when they submit a weekly for the first time.`
            );
        } else {
            // Display current temporary role in embed
            let currentRole = getCurrentRole(bot, thisUser);
            let showCurRole = "None";
            if (currentRole != undefined) {
                showCurRole = currentRole;
            }
            // Display permanent role in embed
            let permaRole = getPermaRole(bot, thisUser);
            let showCurPermaRole = "Not yet achieved";
            if (permaRole != undefined) {
                showCurPermaRole = permaRole;
            }
            embedMsg.setDescription(
                `🏆 ${showCurPermaRole}\nRank: ${showCurRole}`
            );

            // Show submission history
            let showThisWeek = `No submission`;
            let showLastWeek = `No submission`;
            // console.log(submitdata.thisWeek)
            // console.log(submitdata.lastWeek)

            if (submitdata.thisWeek != undefined) {
                showThisWeek = dateTimeString(submitdata.thisWeek);
            }
            if (submitdata.lastWeek != undefined) {
                showLastWeek = dateTimeString(submitdata.lastWeek);
            }
            embedMsg.addField(
                `Submissions`,
                `This week: ${showThisWeek}\nLast week: ${showLastWeek}`,
                false
            );

            // Show streaks
            embedMsg.addField(`Current streak`, `${submitdata.streak}`, true);
            embedMsg.addField(
                `Highest streak`,
                `${submitdata.highestStreak}`,
                true
            );

            // send message
            msg.channel.send({ embeds: [embedMsg] });
        }
    });
}

/**
 * Generates string of the date in the format: HH:MM PM EST YYYY-MM-DD
 * @param {Date} datetime - the date to convert into string
 * @return {String} - HH:MM PM EST YYYY-MM-DD
 */
function dateTimeString(datetime) {
    let date = datetime.toISOString().split("T")[0];
    let time = datetime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    return `${time} EST ${date}`;
}

/**
 * Converts seconds to a string that says N days, N hours, N minutes
 * @param {Number} timeLeft - number of seconds before deadline
 * @return {String} - N days, N hours, N minutes
 */
function secondsToDHM(timeLeft) {
    let days = Math.floor(timeLeft / 86400);
    timeLeft -= days * 86400;
    let hours = Math.floor(timeLeft / 3600) % 24;
    timeLeft -= hours * 3600;
    let minutes = Math.floor(timeLeft / 60) % 60;
    timeLeft -= minutes * 60;
    return `${days} days, ${hours} hours, ${minutes} minutes`;
}

/**
 * Finds the date of next Sunday 11:59 PM EST
 * @param {Date} date - the client that lets F.R.E.T. use discordJS methods
 * @param {Number} dayOfWeek - day of the week (0-6, Sunday is 6)
 * @return {Date} - the new Date object with the date and time properly set
 */
function setDeadline(date, dayOfWeek) {
    let resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));
    return resultDate;
}

/**
 * Retrieves permanent role object
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {User} thisUser - the user object of the role to retrieve
 * @return {currentRole} the currentRole that the user has
 */
function getCurrentRole(bot, thisUser) {
    // retrieves guild object
    let myGuild = bot.guilds.cache.get(configHandler.flux.serverGuild);
    let currentRole = undefined;

    // Get current rank of member
    if (thisUser != undefined) {
        if (thisUser.roles.cache.some((r) => r.name === configHandler.data.wRank1)) {
            currentRole = myGuild.roles.cache.find(
                (r) => r.name === configHandler.data.wRank1
            );
        } else if (thisUser.roles.cache.some((r) => r.name === configHandler.data.wRank2)) {
            currentRole = myGuild.roles.cache.find(
                (r) => r.name === configHandler.data.wRank2
            );
        } else if (thisUser.roles.cache.some((r) => r.name === configHandler.data.wRank3)) {
            currentRole = myGuild.roles.cache.find(
                (r) => r.name === configHandler.data.wRank3
            );
        }
    }
    return currentRole;
}

/**
 * Retrieves permanent role object if the user has it
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {User} thisUser - the user object of the role to retrieve
 * @return {Role} the permanent role as described in config.json
 */
function getPermaRole(bot, thisUser) {
    // retrieves guild object
    let myGuild = bot.guilds.cache.get(configHandler.flux.serverGuild);
    let permaRole = undefined;

    // Get current perma rank of member
    if (thisUser != undefined) {
        if (thisUser.roles.cache.some((r) => r.name === configHandler.data.wRankPerma)) {
            permaRole = myGuild.roles.cache.find(
                (r) => r.name === configHandler.data.wRankPerma
            );
        }
    }
    return permaRole;
}

/**
 * Sends message telling user how to use the command, then deletes
 * both the sent message and original message
 * @param {Message} msg - the original command message
 */
function incorrectSubmit(msg) {
    msg.channel
        .send(
            `**${msg.author}**` +
                ", your submission must include an attachment or link."
        )
        .then((sentMsg) => {
            tools.deleteMsg(sentMsg, 10);
            tools.deleteMsg(msg, 10);
        })
        .catch();
}

/**
 * Sends embed message on how to use the command properly
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.incorrectUsageColor)
        .addField(`\`${prefix}w submit <link/file>\``, "Submit weekly", false)
        .addField(`\`${prefix}w info\``, "Check deadline", false)
        .addField(`\`${prefix}w profile\``, "View your profile", false)
        .addField(
            `\`${prefix}w profile <user>\``,
            "View someone else's profile",
            false
        );
    msg.channel
        .send({ embeds: [embedMsg] })
        .then((sentMsg) => {
            tools.deleteMsg(sentMsg, 15);
            tools.deleteMsg(msg, 15);
        })
        .catch();
}

module.exports = {
    name: "weekly",
    description: "this command submits an entry to the weekly counter",
    execute(bot, prefix, msg, args) {
        switch (true) {
            case args[0] === "submit":
                weeklySubmit(msg, args);
                break;
            case args[0] === "info":
                weeklyInfo(msg);
                break;
            case args[0] === "profile":
                weeklyProfile(bot, msg, args);
                break;
            default:
                incorrectUsage(prefix, msg);
                break;
        }
    },
};
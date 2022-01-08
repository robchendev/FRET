const ids = require(`../config.json`);
const secrets = require(`../secrets.json`);
const mongoose = require("mongoose");
const updateWeekly = require("../models/weeklyUpdate.js");
const { Channel } = require("diagnostics_channel");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Creates a thread to log the results of this week's submissions
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Guild} myGuild - the server object
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} roleStreak - array of point thresholds for each corresponding role
 */
async function createThread(bot, myGuild, roleNames, roleStreak) {
    // create dates
    let dateToday = new Date();
    let dateWeekAgo = new Date();
    dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);

    // Convert to more readable date strings
    let today = dateToday.toISOString().split("T")[0];

    let threadTitle = "Weekly finalization " + today;

    // Start message to create thread
    bot.channels.cache
        .get(ids.weeklyChannel)
        .send("Streaks have been updated.")
        .then(async (sentMsg) => {
            if (
                sentMsg.channel.id === ids.weeklyChannel &&
                sentMsg.author.bot
            ) {
                const thread = await sentMsg.startThread({
                    name: threadTitle,
                });

                updateWeekly.find({}, (err, documents) => {
                    if (err) console.log(err);
                    documents.forEach((submitdata) => {
                        // If submitted this week
                        if (submitdata.thisWeek != undefined) {
                            rankupCheck(
                                bot,
                                myGuild,
                                thread,
                                submitdata,
                                roleNames,
                                roleStreak
                            );
                        }

                        // If did not submit this week but submitted last week
                        else if (submitdata.lastWeek != undefined) {
                            resetStreak(submitdata);
                            repairRoles(submitdata, myGuild, roleNames);
                            let name = bot.users.cache.get(submitdata.userid);
                            if (name != undefined) {
                                name = name.username;
                                thread.send(
                                    `**${name}** lost their rank. Streak: **${submitdata.streak}**`
                                );
                            }
                        }
                        startNewWeek(submitdata);
                        submitdata.save().catch((err) => console.log(err));
                    });
                });
            }
        })
        .catch();
}

/**
 * Gives role to user and sends message in thread
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Guild} myGuild - the server object
 * @param {Channel} thread - the thread to send messages in
 * @param {Schema} submitdata - schema that stores submission data
 * @param {Array} roleNames - array of roles to be given
 * @param {Number} index - array index of roleNames of which role to grant
 */
function doRankUp(bot, myGuild, thread, submitdata, roleNames, index) {
    // need intent GUILD_PRESENCES for this to work
    let name = bot.users.cache.get(submitdata.userid);
    let user = myGuild.members.cache.get(submitdata.userid);

    // if user exists
    if (name != undefined && user != undefined) {
        name = name.username;

        // If user does not have new role
        if (!user.roles.cache.has(roleNames[index].id)) {
            // removes roles if user has them (since we're upgrading roles)
            repairRoles(submitdata, myGuild, roleNames);
            user.roles.add(roleNames[index].id);
            thread.send(
                `**${name}** ranked up to **${roleNames[index].name}**! Streak: **${submitdata.streak}**`
            );
        }
        // when user is maintaining role
        else {
            thread.send(
                `**${name}** maintained their rank. Streak: **${submitdata.streak}**`
            );
        }
    }
}

/**
 * Permanently grants role once reached threshold described in config.json
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Guild} myGuild - the server object
 * @param {Channel} thread - the thread to send messages in
 * @param {Schema} submitdata - schema that stores submission data
 */
function permaRank(bot, myGuild, thread, submitdata) {
    // need intent GUILD_PRESENCES for this to work
    let name = bot.users.cache.get(submitdata.userid);
    let user = myGuild.members.cache.get(submitdata.userid);

    // retrieve rank
    let permaRankRole = myGuild.roles.cache.find(
        (r) => r.name === ids.wRankPerma
    );

    // if user exists
    if (name != undefined && user != undefined) {
        name = name.username;

        // If user does not have new role
        if (!user.roles.cache.has(permaRankRole.id)) {
            user.roles.add(permaRankRole.id);
            thread.send(
                `**${name}** has achieved the permanent :trophy: **${permaRankRole.name}** rank for reaching ${ids.wRankPermaStreak} streaks in a row!`
            );
        }
    }
}

/**
 * Determines what role is to be given to a user, if applicable.
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Guild} myGuild - the server object
 * @param {Channel} thread - the thread to send messages in
 * @param {Schema} submitdata - schema that stores submission data
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} roleStreak - array of point thresholds for each corresponding role
 */
function rankupCheck(bot, myGuild, thread, submitdata, roleNames, roleStreak) {
    updateStreak(submitdata);
    switch (true) {
        case submitdata.streak >= roleStreak[2]: // 7 streak
            doRankUp(bot, myGuild, thread, submitdata, roleNames, 2);
            break;
        case submitdata.streak >= roleStreak[1] && submitdata.streak < roleStreak[2]: // 3-6 streak
            doRankUp(bot, myGuild, thread, submitdata, roleNames, 1);
            break;
        case submitdata.streak >= roleStreak[0] && submitdata.streak < roleStreak[1]: // 1-2 streak
            doRankUp(bot, myGuild, thread, submitdata, roleNames, 0);
            break;
    }
    if (submitdata.highestStreak >= ids.wRankPermaStreak) {
        permaRank(bot, myGuild, thread, submitdata);
    }
}

/**
 * Removes all roles in roleNames from the user
 * @param {Schema} submitdata - holds submission data
 * @param {Guild} myGuild - the discord server
 * @param {Array} roleNames - roles to be given
 */
function repairRoles(submitdata, myGuild, roleNames) {
    // retrieve member object for user
    let user = myGuild.members.cache.get(submitdata.userid);
    if (user != undefined) {
        for (var i = 0; i < roleNames.length; i++) {
            if (user.roles.cache.has(roleNames[i].id)) {
                user.roles.remove(roleNames[i].id);
            }
        }
    }
}

/**
 * Updates streak and highestStreak count
 * @param {Schema} submitdata - holds submission data
 */
function updateStreak(submitdata) {
    submitdata.streak += 1;
    if (submitdata.highestStreak < submitdata.streak) {
        submitdata.highestStreak = submitdata.streak;
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
 * Moves all week data down one week and sets thisWeek to undefined
 * @param {Schema} submitdata - holds submission data
 */
function startNewWeek(submitdata) {
    submitdata.lastWeek = submitdata.thisWeek;
    submitdata.thisWeek = undefined;
}

/**
 * This doesnt error check for permissions, so make sure the bot
 * has permission to view, send messages, and create threads in
 * ids.weeklyChannel.
 */
module.exports = {
    name: "weeklyCron",
    description:
        "this command is passively invoked on Monday 12:00 AM EST every week to update roles for the weekly submissions.",
    execute(bot) {
        // retrieves guild object
        let myGuild = bot.guilds.cache.get(ids.serverGuild);

        // Weekly streak roles
        var roleNames = [
            /*0*/ myGuild.roles.cache.find((r) => r.name === ids.wRank1),
            /*1*/ myGuild.roles.cache.find((r) => r.name === ids.wRank2),
            /*2*/ myGuild.roles.cache.find((r) => r.name === ids.wRank3),
        ];

        // the points that are required to get each streak role
        var roleStreak = [
            /*0*/ ids.wRank1Streak,
            /*1*/ ids.wRank2Streak,
            /*2*/ ids.wRank3Streak,
        ];

        createThread(bot, myGuild, roleNames, roleStreak);
    },
};

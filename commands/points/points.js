const Discord = require("discord.js");
const mongoose = require("mongoose");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();

const secrets = require(`../../secrets.json`);
const pointsAdd = require("../../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Sends an embed message on how many points the user has
 * @param {Message} msg - the original command message
 * @param {String} userID - a single user's ID
 */
function findPoints(msg, userID) {
    howManyPoints(userID, (err, pointdata) => {
        if (err) {
            console.log(err);
        } else if (pointdata) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor(configHandler.data.transparentColor)
                .setDescription(`${userID} has **${pointdata}** points.`);
            msg.channel.send({ embeds: [embedMsg] });
        } else {
            msg.channel.send(`User does not have any points!`);
        }
    });
}

/**
 * Pulls the user's points data from the database
 * @param {String} userID - a single user's ID
 * @param {Callback} cb - callback
 */
function howManyPoints(userID, cb) {
    pointsAdd.findOne({ userid: userID }, (err, pointdata) => {
        if (err) return cb(err, null);
        if (pointdata) {
            //console.log(pointdata.points);
            return cb(null, pointdata.points);
        } else return cb(null, null);
    });
}

/**
 * Sends embed message on how to use the command properly
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(prefix, msg) {
    const embedMsg1 = new Discord.MessageEmbed()
        .setColor(configHandler.data.incorrectUsageColor)
        .addField(`\`${prefix}points\``, "View your points", false)
        .addField(
            `\`${prefix}points <user>\``,
            "View someone else's points",
            false
        );
    msg.channel.send({ embeds: [embedMsg1] });
}

module.exports = {
    name: "points",
    description: "this command shows how many points a user has",

    execute(prefix, msg, args) {
        //if command doesnt have any arguments "-points"
        if (!args.length) {
            // Removes nickname ! in ID
            let thisUser = String(msg.member).replace("!", "");
            findPoints(msg, thisUser);
        }

        //if command has one argument "-points @user" and it's a mention
        else if (
            args.length === 1 &&
            args[0].startsWith("<@") &&
            args[0].endsWith(">")
        ) {
            // Removes nickname ! in ID
            let thisUser = String(msg.mentions.users.first()).replace(
                "/!",
                "/"
            );
            findPoints(msg, thisUser);
        }

        //every other condition is incorrect
        else {
            incorrectUsage(prefix, msg);
        }
    },
};

const Discord = require("discord.js");
const mongoose = require("mongoose");
const ids = require(`../ids.json`);
const secrets = require(`../secrets.json`);
var tools = require(`../tools/functions.js`);
const pointsChange = require("../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const UpdateOptions = Object.freeze({
    Add = 0,
    Set = 1
});

function updatePointsForUser(message, userid, amount, options) {
    pointsChange.findOne({ userid: userId }, (findError, pointData) => {
        if (findError !== undefined)
            console.error(error);
        else {
            let pointsUpdated = false;
            let incomingPointData = pointData;
            try {
                if (pointData === undefined) {
                    pointData = tools.createPointDataForUser(pointsChange, userId);
                    pointData.points = amount;
                } else {
                    if (options === UpdateOptions.Add)
                        pointData.points += amount;
                    else if (options === UpdateOptions.Set)
                        pointData.points = amount;
                }

                tools.savePointData(pointData);
                pointsUpdated = incomingPointData !== pointData;
            } catch (error) { console.error(exception.message); }

            if (pointsUpdated) {
                const embed = new Discord.MessageEmbed()
                    .setColor(ids.dataChangeColor)
                    .setDescription(`${userId}'s points have been changed to ${pointData.points}`);
                message.channel.send({ embeds: [embed] });
            }
        }
    });
}
/**
 * Sends embed message on how to use the command properly then deletes it
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(ids.incorrectUsageColor)
        .addField(
            `\`${prefix}points inc <user> <points>\``,
            "Increase user's points by amount",
            false
        )
        .addField(
            `\`${prefix}points dec <user> <points>\``,
            "Decrease user's points by amount",
            false
        )
        .addField(
            `\`${prefix}points set <user> <points>\``,
            "Set user's points to amount",
            false
        )
        .addField(
            `\`${prefix}points pen <user>\``,
            "Decrease user's points by 1000",
            false
        );
    msg.channel
        .send({ embeds: [embedMsg] })
        .then((sentMsg) => {
            tools.deleteMsg(sentMsg, 10);
            tools.deleteMsg(msg, 10);
        })
        .catch((error) => { console.error(error); });
}
function sendCorrectUsageMessage(prefix) {
    msg.channel
        .send(`Correct Usage: \`${prefix}points <@user> <amount> [options: set]\`.`)
        .then((sentMessage) => {
            tools.deleteMsg(sentMessage, 10);
            tools.deleteMsg(msg, 10);
        })
        .catch((error) => { console.error(error); });
}
function getAmountArgument(prefix, args) {
    let result = undefined;
    if (isNaN(parseInt(args[1])))
        sendCorrectUsageMessage(prefix);
    else
        result = args[1];
    return result;
}
function getOptionsArgument(prefix, args) {
    let result = UpdateOptions.Add;
    if (args.length === 3) {
        if (args[2] === "set")
            updateOptions = UpdateOptions.Set;
        else {
            result = undefined;
            sendCorrectUsageMessage(prefix);
        }
    }
    return result;
}
module.exports = {
    name: "pointsMod",
    description: "this mod command changes the points of a user",
    execute(prefix, msg, args) {
        if (args.length < 2)
            incorrectUsage(prefix, msg);
        else {
            let amount = getAmountArgument(prefix, args);
            if (amount !== undefined) {
                let updateOptions = getOptionsArgument(prefix, args);
                if (updateOptions != undefined) {
                    let userId = String(msg.mentions.users.first()).replace("!", "");
                    updatePointsForUser(msg, userId, amount, updateOptions);
                }
            }
        }
    }
};
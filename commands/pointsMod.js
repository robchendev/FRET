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
function sendCorrectUsageMessage(message, prefix) {
    message.channel
        .send(`Correct Usage: \`${prefix}points <@user> <amount> [options: set]\`.`)
        .then((sentMessage) => {
            tools.deleteMsg(sentMessage, 10);
            tools.deleteMsg(message, 10);
        })
        .catch((error) => { console.error(error); });
}
function getAmountArgument(message, prefix, args) {
    let result = undefined;
    if (isNaN(parseInt(args[1])))
        sendCorrectUsageMessage(message, prefix);
    else
        result = args[1];
    return result;
}
function getOptionsArgument(message, prefix, args) {
    let result = UpdateOptions.Add;
    if (args.length === 3) {
        if (args[2] === "set")
            updateOptions = UpdateOptions.Set;
        else {
            result = undefined;
            sendCorrectUsageMessage(message, prefix);
        }
    }
    return result;
}
module.exports = {
    name: "pointsMod",
    description: "this mod command changes the points of a user",
    execute(prefix, msg, args) {
        if (args.length < 2)
            sendCorrectUsageMessage(msg, prefix);
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
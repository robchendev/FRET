const Discord = require("discord.js");
const mongoose = require("mongoose");
const config = require(`../config.json`);
const secrets = require(`../secrets.json`);
const messageHandler = require(`../handlers/messageHandler.js`);
const pointHandler = require(`../handlers/pointHandler.js`);
const pointsChange = require("../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
/** Options describing how a user's points should be updated. */
const PointUpdateOptions = Object.freeze({
    /** Add to the user's points. */
    Add: 0,
    /** Set the user's points to a specific value. */
    Set: 1
});
/**
 * Update point data for a specified user. The default behavior is to add the specified amount.
 * @param {DiscordMessage} message The original message received from Discord.
 * @param {String} userId The Discord mention ID of the user.
 * @param {Number} amount The amount to use for updating the user's points.
 * @param {PointUpdateOptions} options The options describing how the user's points should be updated.
 */
function updatePointsForUser(message, userId, amount, options) {
    pointsChange.findOne({ userid: userId }, (findError, pointData) => {
        if (findError !== null)
            console.error(findError);
        else {
            let pointsUpdated = false; 
            let incomingPointData = JSON.parse(JSON.stringify(pointData));
            try {
                if (pointData === null) {
                    pointData = pointHandler.createPointDataForUser(pointsChange, userId);
                    pointData.points = amount;
                } else {
                    if (options === PointUpdateOptions.Add)
                        pointData.points += amount; 
                    else if (options === PointUpdateOptions.Set)
                        pointData.points = amount;
                }
                
                pointHandler.savePointData(pointData);
                pointsUpdated = (incomingPointData === null && pointData !== null) ||
                                (incomingPointData.points !== pointData.points);
            } catch (error) { console.error(error); }

            if (pointsUpdated) {
                const embed = new Discord.MessageEmbed()
                    .setColor(config.dataChangeColor)
                    .setDescription(`${userId}'s points have been changed to ${pointData.points}`);
                message.channel.send({ embeds: [embed] });
            }
        }
    });
}
/**
 * 
 * @param {DiscordMessage} message 
 * @param {Object[]} args 
 * @returns 
 */
function getAmountArgument(message, args) {
    let result = undefined;
    if (isNaN(parseInt(args[1])))
        messageHandler.sendCommandUsageMessage(message);
    else
        result = parseInt(args[1]);
    return result;
}
/**
 * 
 * @param {DiscordMessage} message 
 * @param {Object[]} args 
 * @returns 
 */
function getOptionsArgument(message, args) {
    let result = PointUpdateOptions.Add;
    if (args.length === 3) {
        if (args[2] === "set")
            result = PointUpdateOptions.Set;
        else {
            result = undefined;
            messageHandler.sendCommandUsageMessage(message);
        }
    }
    return result;
}
module.exports = {
    prefix: undefined,
    key: "points",
    name: "pointsMod",
    isModeratorCommand: true,
    description: "this mod command changes the points of a user",
    syntax: `${config.moderatorPrefix}points <@user> <amount> [options: set]`,
    fieldDescriptions: [
        { name: "`<@user>`", value: "This is the mention of the user the command should target." },
        { name: "`<amount>`", value: "This is the integer value of the amount of points the targeted user should recieve. This value should be positive to add points, or negative to remove points." },
        { name: "`[options]`", value: "The only supported value for this is `set`. Supplying this option will set the targeted user's points to the specified amount." }
    ],
    registerWithHandlers() {
        pointHandler.register(this);
        messageHandler.register(this);
    },
    execute(prefix, msg, args) {
        if (args.length < 2)
            sendCorrectUsageMessage(msg);
        else {
            let amount = getAmountArgument(msg, args);
            if (amount !== undefined) {
                let updateOptions = getOptionsArgument(msg, args);
                if (updateOptions != undefined) {
                    let userId = String(msg.mentions.users.first()).replace("!", "");
                    updatePointsForUser(msg, userId, amount, updateOptions);
                }
            }
        }
    }
};
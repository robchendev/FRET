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
    Add: 0,
    Set: 1
});
                                
function updatePointsForUser(message, userId, amount, options) 
    pointsChange.findOne({ userid: userId }, (findError, pointData) => {
        if (findError === null)
            console.error(findError);
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
            } catch (error) { console.error(error); }

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
    const embed = new Discord.MessageEmbed()
        .setColor(ids.dataChangeColor)
        .setTitle(`Correct Usage for the \`${prefix}points\` Command`)
        .setDescription(`The syntax for the \`${prefix}points\` command is: \`\`\`${prefix}points <@user> <amount> [options: set]\`\`\`.`)
        .addFields(
            { name: "`<@user>`", value: "This is the mention of the user the command should target." },
            { name: "`<amount>`", value: "This is the integer value of the amount of points the targeted user should recieve. This value should be positive to add points, or negative to remove points." },
            { name: "`[options]`", value: "The only supported value for this is `set`. Supplying this option will set the targeted user's points to the specified amount." }
        )
        .setFooter({text: "This message will self destruct in 10 seconds."}) 
        .setTimestamp();
    message.channel.send({ embeds: [embed] })
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
            result = UpdateOptions.Set;
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
            let amount = getAmountArgument(msg, prefix, args);
            if (amount !== undefined) {
                let updateOptions = getOptionsArgument(msg, prefix, args);
                if (updateOptions != undefined) {
                    let userId = String(msg.mentions.users.first()).replace("!", "");
                    updatePointsForUser(msg, userId, amount, updateOptions);
                }
            }
        }
    }
};
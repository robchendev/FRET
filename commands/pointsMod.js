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

/**
 * Decreases users points in database and sends an embed message
 * @param {Message} msg - the original message sent
 * @param {String} usersID - a single user's ID
 * @param {Number} deincrement - the amount of points to subtract by
 */
function decPoints(msg, usersID, deincrement) {
    pointsChange.findOne({ userid: usersID }, (err, pointdata) => {
        if (err) console.log(err);
        if (!pointdata) {
            tools.createPointdata(pointsChange, usersID, -deincrement);
            const embedMsg = new Discord.MessageEmbed()
                .setColor(ids.dataChangeColor)
                .setDescription(
                    `${usersID}'s points have been changed from 0 to ${-deincrement}`
                );
            msg.channel.send({ embeds: [embedMsg] });
        } else {
            beforeChange = pointdata.points;
            tools.updatePointdata(pointdata, -deincrement);
            const embedMsg = new Discord.MessageEmbed()
                .setColor(ids.dataChangeColor)
                .setDescription(
                    `${usersID}'s points have been changed from ${beforeChange} to ${pointdata.points}`
                );
            msg.channel.send({ embeds: [embedMsg] });
        }
    });
}

/**
 * Sets users points in database and sends an embed message
 * @param {Message} msg - the original message sent
 * @param {String} usersID - a single user's ID
 * @param {Number} set - the points amount to be set to
 */
function setPoints(msg, usersID, set) {
    const embedMsg = new Discord.MessageEmbed().setColor(ids.dataChangeColor);

    pointsChange.findOne({ userid: usersID }, (err, pointdata) => {
        if (err) console.log(err);
        if (!pointdata) {
            tools.createPointdata(pointsChange, usersID, set);
            embedMsg.setDescription(
                `${usersID}'s points have been changed from 0 to ${set}`
            );
            msg.channel.send({ embeds: [embedMsg] });
        } else {
            beforeChange = pointdata.points;
            tools.setPointdata(pointdata, set);
            embedMsg.setDescription(
                `${usersID}'s points have been changed from ${beforeChange} to ${pointdata.points}`
            );
            msg.channel.send({ embeds: [embedMsg] });
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
    .catch();
}

module.exports = {
    name: "pointsMod",
    description: "this mod command changes the points of a user",
    execute(prefix, msg, args) {
        if (args.length > 0) {
            // Removes nickname ! in ID
            let mention = String(msg.mentions.users.first()).replace("!", "");
            let doCommand = args[0];
            switch (doCommand) {
                case "inc":
                    let increment = args[2];
                    if (!isNaN(parseInt(increment))) {
                        decPoints(msg, mention, increment * -1);
                    } else {
                        msg.channel.send(
                            `Correct usage: \`${prefix}points inc <user> <points>\``
                        )
                        .then((sentMsg) => {
                            tools.deleteMsg(sentMsg, 10);
                            tools.deleteMsg(msg, 10);
                        })
                        .catch();
                    }
                    break;
                case "dec":
                    let deincrement = args[2];
                    if (!isNaN(parseInt(deincrement))) {
                        decPoints(msg, mention, deincrement);
                    } else {
                        msg.channel.send(
                            `Correct usage: \`${prefix}points dec <user> <points>\``
                        )
                        .then((sentMsg) => {
                            tools.deleteMsg(sentMsg, 10);
                            tools.deleteMsg(msg, 10);
                        })
                        .catch();
                    }
                    break;
                case "set":
                    let set = args[2];
                    if (!isNaN(parseInt(set))) {
                        setPoints(msg, mention, set);
                    } else {
                        msg.channel.send(
                            `Correct usage: \`${prefix}points set <user> <points>\``
                        )
                        .then((sentMsg) => {
                            tools.deleteMsg(sentMsg, 10);
                            tools.deleteMsg(msg, 10);
                        })
                        .catch();
                    }
                    break;
                case "pen":
                    if(mention != "undefined"){
                        decPoints(msg, mention, 1000);
                    } else {
                        msg.channel.send(
                            `Correct usage: \`${prefix}points pen <user>\``
                        )
                        .then((sentMsg) => {
                            tools.deleteMsg(sentMsg, 10);
                            tools.deleteMsg(msg, 10);
                        })
                        .catch();
                    }
                    break;
                default:
                    incorrectUsage(prefix, msg);
                    break;
            }
        } else {
            incorrectUsage(prefix, msg);
        }
    },
};

const Discord = require("discord.js");
const mongoose = require("mongoose");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();
const pointsAdd = require("../../models/addPoints.js");
mongoose.connect(configHandler.secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Determines what role is to be given to a user, if applicable.
 * @param {Message} msg - the original command message
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function rankupCheck(msg, roleNames, rolePoints) {
    // Removes nickname ! in ID
    let thisUser = String(msg.member).replace("!", "");

    howManyPoints(thisUser, (err, pointdata) => {
        if (err) console.log(err);
        else if (pointdata) {
            switch (true) {
                case pointdata >= rolePoints[5]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 5);
                    break;
                case pointdata >= rolePoints[4] && pointdata < rolePoints[5]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 4);
                    break;
                case pointdata >= rolePoints[3] && pointdata < rolePoints[4]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 3);
                    break;
                case pointdata >= rolePoints[2] && pointdata < rolePoints[3]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 2);
                    break;
                case pointdata >= rolePoints[1] && pointdata < rolePoints[2]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 1);
                    break;
                case pointdata >= rolePoints[0] && pointdata < rolePoints[1]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 0);
                    break;
                case pointdata < rolePoints[0]:
                    hasNoRank(msg, thisUser, roleNames, rolePoints);
                    break;
                case pointdata === 0:
                    repairRoles(msg.member, rolePoints, roleNames);
                    msg.channel.send(
                        `${thisUser}, you do not have any points! Please contribute by answering questions to get started.`
                    );
                default:
                    msg.channel.send(
                        `${thisUser}, you do not have any points! Please contribute by answering questions to get started.`
                    );
                    break;
            }
        } else {
            msg.channel.send(
                `**${thisUser}**, you do not have any points! Please contribute by answering questions to get started.`
            );
            repairRoles(msg.member, rolePoints, roleNames);
        }
    });
}

/**
 * First checks for incorrect roles (due to manual human assignment),
 * then gives the user the role they deserve, or tells them how many
 * points they need before reaching the next rank. If the user already
 * has the highest role, tell them they have the highest role.
 * @param {Object} msg - the original command message
 * @param {String} thisUser - id of the user to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 * @param {Number} index - the index of the roleNames and rolePoints arrays to pull data from
 */
function doRankUp(msg, thisUser, roleNames, rolePoints, index) {
    //If user does not have the role
    if (!msg.member.roles.cache.has(roleNames[index].id)) {
        //Remove roles if the user has them
        repairRoles(msg.member, rolePoints, roleNames);

        msg.member.roles.add(roleNames[index].id);
        const embedMsg = new Discord.MessageEmbed().setColor(configHandler.data.thanksColor);
        if (index === 5) {
            embedMsg.setDescription(
                `${msg.member} has ranked up to ${roleNames[index]}!\nCongrats, you have reached the highest rank!`
            );
        } else {
            embedMsg.setDescription(
                `${msg.member} has ranked up to ${roleNames[index]}!\n`
            );
        }
        msg.channel.send({ embeds: [embedMsg] });
    }
    //If user already has the role
    else {
        //If the user's current role isn't the highest
        if (index + 1 < rolePoints.length) {
            howManyPoints(thisUser, (err, points) => {
                if (err) console.log(err);
                else if (points) {
                    const embedMsg = new Discord.MessageEmbed()
                        .setColor(configHandler.data.transparentColor)
                        .setDescription(
                            `${thisUser}, you need **${
                                rolePoints[index + 1] - points
                            }** points to rank up to ${roleNames[index + 1]}.`
                        );
                    msg.channel.send({ embeds: [embedMsg] });
                } else console.log("no data found");
            });
        } else {
            msg.channel.send(
                `${thisUser}, you have already attained the highest possible role.`
            );
        }
    }
}

/**
 * Removes all roles in roleNames from the user
 * @param {String} thisUser - User to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function repairRoles(thisUser, rolePoints, roleNames) {
    for (var i = 0; i < rolePoints.length; i++) {
        if (thisUser.roles.cache.has(roleNames[i].id)) {
            thisUser.roles.remove(roleNames[i].id);
        }
    }
}

/**
 * Pulls the user's points data from the database
 * @param {String} thisUser - id of the user to find points of
 * @param {Callback} cb - callback
 */
function howManyPoints(thisUser, cb) {
    pointsAdd.findOne({ userid: thisUser }, (err, pointdata) => {
        if (err) return cb(err, null);
        if (pointdata) {
            return cb(null, pointdata.points);
        } else {
            return cb(null, null);
        }
    });
}

/**
 * Removes rank if the user has it already, and sends an embed
 * message about how many points the user needs for the next rank
 * @param {Message} msg - the original command message
 * @param {String} thisUser - id of the user to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function hasNoRank(msg, thisUser, roleNames, rolePoints) {
    //Check if user somehow has a role already. If they do, remove it.
    repairRoles(msg.member, rolePoints, roleNames);

    howManyPoints(thisUser, (err, points) => {
        if (err) console.log(err);
        else if (points) {
            const embedMsg = new Discord.MessageEmbed()
                .setColor(configHandler.data.transparentColor)
                .setDescription(
                    `${thisUser}, you need **${
                        rolePoints[0] - points
                    }** points to rank up to ${roleNames[0]}.`
                );
            msg.channel.send({ embeds: [embedMsg] });
        } else console.log("no data found");
    });
}

module.exports = {
    name: "rankup",
    description:
        "this command determines if a user should rank up, down, or stay the same",
    execute(msg) {
        //the roles in the server that are to be used for this bot
        var roleNames = [
            /*0*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank1),
            /*1*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank2),
            /*2*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank3),
            /*3*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank4),
            /*4*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank5),
            /*5*/ msg.guild.roles.cache.find((r) => r.name === configHandler.data.rank6),
        ];

        //the points that are required to get each role
        var rolePoints = [
            /*0*/ configHandler.data.rank1Points,
            /*1*/ configHandler.data.rank2Points,
            /*2*/ configHandler.data.rank3Points,
            /*3*/ configHandler.data.rank4Points,
            /*4*/ configHandler.data.rank5Points,
            /*5*/ configHandler.data.rank6Points,
        ];

        rankupCheck(msg, roleNames, rolePoints);
    },
};

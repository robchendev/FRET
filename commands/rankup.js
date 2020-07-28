const Discord = require('discord.js');
const mongoose = require('mongoose');
const secrets = require(`../secrets.json`);
const pointsAdd = require("../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Removes all roles in roleNames from the user
 * @param {string} thisUser - id of the user to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function repairRoles(thisUser, rolePoints, roleNames){
    for (var i = 0; i < rolePoints.length; i++){
        if (thisUser.roles.cache.has(roleNames[i].id)){
            thisUser.roles.remove(roleNames[i].id)
        }
    }
}

/**
 * Pulls the user's points data from the database
 * @param {string} thisUser - id of the user to find points of
 * @param {none} cb - callback 
 */
function howManyPoints(thisUser, cb) {

    pointsAdd.findOne({userid: thisUser}, (err, pointdata) => {
        if(err) 
            return cb(err, null);
        if(pointdata)
            return cb(null, pointdata.points);
        else
            return cb(null, null);
    })
}

/**
 * First checks for incorrect roles (due to manual human assignment),
 * then gives the user the role they deserve, or tells them how many
 * points they need before reaching the next rank. If the user already 
 * has the highest role, tell them they have the highest role.
 * @param {Object} msg - the original command message 
 * @param {string} thisUser - id of the user to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 * @param {number} index - the index of the roleNames and rolePoints arrays to pull data from
 */
function doRankUp(msg, thisUser, roleNames, rolePoints, index) {
    
    //If user does not have the role
    if (!thisUser.roles.cache.has(roleNames[index].id)){
        //Remove roles if the user has them
        repairRoles(thisUser, rolePoints, roleNames);

        thisUser.roles.add(roleNames[index].id);
        const embedMsg = new Discord.MessageEmbed()
        .setColor('#2ecc71')
        if (index === 5){
            embedMsg.setDescription(`${thisUser} has ranked up to ${roleNames[index]}!\nCongrats, you now have access to the members chats!`);
        } else {
            embedMsg.setDescription(`${thisUser} has ranked up to ${roleNames[index]}!\n`);
        }
        msg.channel.send(embedMsg);
    }
    //If user already has the role
    else {
        //If the user's current role isn't the highest
        if ((index + 1) < rolePoints.length){
            howManyPoints(thisUser, (err, points) => {
                if(err)
                    console.log(err);
                else if(points){
                    const embedMsg = new Discord.MessageEmbed()
                    .setColor('#f1c40f')
                    .setDescription(`${thisUser}, you need **${(rolePoints[index+1]-points)}** points to rank up to ${roleNames[index+1]}.`);
                    msg.channel.send(embedMsg);
                }
                else
                    console.log("no data found");
            })
            
        }
        else {
            msg.channel.send(`${thisUser}, you have already attained the highest possible role.`);
        }
    }
}

/**
 * Removes rank if the user has it already, and sends an embed
 * message about how many points the user needs for the next rank
 * @param {Object} msg - the original command message 
 * @param {string} thisUser - id of the user to adjust the roles of
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function hasNoRank(msg, thisUser, roleNames, rolePoints,) {

    //Check if user somehow has a role already. If they do, remove it.
    repairRoles(thisUser, rolePoints, roleNames);

    howManyPoints(thisUser, (err, points) => {
        if(err)
            console.log(err);
        else if(points){
            const embedMsg = new Discord.MessageEmbed()
            .setColor('#f1c40f')
            .setDescription(`${thisUser}, you need **${(rolePoints[0]-points)}** points to rank up to ${roleNames[0]}.`);
            msg.channel.send(embedMsg);
        }
        else
            console.log("no data found");
    })
}

/**
 * Determines what role is to be given to a user, if applicable.
 * @param {Object} msg - the original command message 
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function rankupCheck(msg, roleNames, rolePoints) {
    
    let thisUser = msg.member;
    howManyPoints(thisUser, (err, points) => {
        if(err)
            console.log(err);
        else if(points){
            switch (true) {
                case points >= rolePoints[5]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 5);
                    break;
                case points >= rolePoints[4] && points < rolePoints[5]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 4);
                    break;
                case points >= rolePoints[3] && points < rolePoints[4]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 3);
                    break;
                case points >= rolePoints[2] && points < rolePoints[3]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 2);
                    break;    
                case points >= rolePoints[1] && points < rolePoints[2]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 1);
                    break;    
                case points >= rolePoints[0] && points < rolePoints[1]:
                    doRankUp(msg, thisUser, roleNames, rolePoints, 0);
                    break;
                case points <  rolePoints[0]:
                    hasNoRank(msg, thisUser, roleNames, rolePoints);
                    break;
                case points === 0:
                    repairRoles(thisUser, rolePoints, roleNames);
                    msg.channel.send(`${thisUser}, you do not have any points! Please contribute by answering questions to get started.`);
                default:
                    msg.channel.send(`${thisUser}, you do not have any points! Please contribute by answering questions to get started.`);
                    break;
            }
        }
        else
            repairRoles(thisUser, rolePoints, roleNames);
    });
}

module.exports = {
    name: 'rankup',
    description: "this command determines if a user is ready to rank up. If so, they will rank up.",
    execute (msg){

        //the roles in the server that are to be used for this bot
        var roleNames = [
            /*0*/msg.guild.roles.cache.find(r => r.name === "Peer"),
            /*1*/msg.guild.roles.cache.find(r => r.name === "Teacher"),
            /*2*/msg.guild.roles.cache.find(r => r.name === "Mentor"),
            /*3*/msg.guild.roles.cache.find(r => r.name === "Advisor"),
            /*4*/msg.guild.roles.cache.find(r => r.name === "Lecturer"),
            /*5*/msg.guild.roles.cache.find(r => r.name === "Tenure")
        ];
        
        //the points that are required to get each role
        var rolePoints = [
            /*0*/200,
            /*1*/500,
            /*2*/1000,
            /*3*/2500,
            /*4*/5000,
            /*5*/10000
        ];

        rankupCheck(msg, roleNames, rolePoints);
    }
}
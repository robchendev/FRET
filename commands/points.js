const Discord = require('discord.js');
const mongoose = require('mongoose');
const secrets = require(`../secrets.json`);
const pointsAdd = require("../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Pulls the user's points data from the database
 * @param {string} userID - a single user's ID
 * @param {none} cb - callback
 */
function howManyPoints(userID, cb) {

    pointsAdd.findOne({userid: userID}, (err, pointdata) => {
        if(err) 
            return cb(err, null);
        if(pointdata)
            return cb(null, pointdata.points);
        else
            return cb(null, null);
    })
}

/**
 * Sends an embed message on how many points the user has
 * @param {*} msg - the original command message
 * @param {*} userID - a single user's ID
 */
function findPoints(msg, userID){

    howManyPoints(userID, (err, points) => {
        if(err){
            console.log(err);
        }
        else if(points){
            const embedMsg = new Discord.MessageEmbed()
            .setColor('#36393F')
            .setDescription(`${userID}, you have **${(points)}** points.`);
            msg.channel.send(embedMsg);
        }
        else{
            msg.channel.send(`${userID}, you do not have any points! Please contribute by answering questions to get started.`);
        }
    });
}

/**
 * Sends embed message on how to use the command properly
 * @param {*} prefix - the prefix of the command
 * @param {*} msg - the original command message
 */
function incorrectUsage(prefix, msg) {

    const embedMsg1 = new Discord.MessageEmbed()
    .setColor('#f51637')
    .addField('View your points', `\`${prefix}points\``, false)
    .addField('View someone else\'s points', `\`${prefix}points <user>\``, false)
    .setFooter('Do not include < and >. Use @','');
    msg.channel.send(embedMsg1);
}

module.exports = {
    name: 'points',
    description: "this command shows how many points a user has",
    
    execute (prefix, msg, args){

        //if command doesnt have any arguments "-points"
        if(!args.length){
            findPoints(msg, msg.author);
        }

        //if command has one argument "-points @user" and it's a mention
        else if(args.length === 1 && args[0].startsWith('<@') && args[0].endsWith('>')){
            let mention = msg.mentions.users.first();
            findPoints(msg, mention);
        }

        //every other condition is incorrect
        else {
            incorrectUsage(prefix, msg);
        }
    }
}
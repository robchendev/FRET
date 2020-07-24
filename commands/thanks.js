const Discord = require('discord.js');
const mongoose = require('mongoose');
const pointsAdd = require("../models/addPoints.js");
const secrets = require(`../secrets.json`);
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Checks command arguments for duplicates.
 * @param {Array} arr - array of command arguments (after -thanks command)
 * @return {Boolean} true if array has at least one duplicate, false otherwise
 */
function getDuplicateArrayElements(arr){

    var sorted_arr = arr.slice().sort();
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if command arguments are all mentions
 * @param {Array} arr - array of command arguments (after -thanks command)
 * @return {Boolean} false if array has at least one mention, true otherwise.
 */
function isAllMentions(arr){

    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i].startsWith('<@') && arr[i].endsWith('>'))) {
            if (arr[i].startsWith('!')) {
                arr[i] = arr[i].slice(1);
            }
            return false;
        }
    }
    return true;
}

/**
 * Converts user IDs to usernames
 * @param {Array} arr - array of user IDs
 * @return {Array} array of usernames
 */
function idToName(arr){

    const result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i].username;
    }
    return result;
}

/**
 * Adds points to the user's data in the database
 * by updating the usernames and points of the user
 * If their data doesn't exist, it is made.
 * @param {string} usersID - a single user's ID
 * @param {string} usersName - a single user's username
 * @param {number} score - the amount of points to be added
 */
function thank (usersID, usersName, score) {
    
    pointsAdd.findOne({userid: usersID}, (err, pointdata) => {
        if(err) console.log(err);
        if(!pointdata){
            const addPoints = new pointsAdd({
                userid: usersID,
                username: usersName,
                points: score
            })
            addPoints.save().catch(err => console.log(err));
        } else {
            pointdata.points = pointdata.points + score;
            pointdata.save().catch(err => console.log(err));
            
        }
    })
}

/** PUT THIS IN ANOTHER COMMAND
 * Checks how many points a user has
 * @param {string} usersID - a single user's ID
 * @param {none} cb - callback
 */
function howManyPoints(usersID, cb) {

    pointsAdd.findOne({userid: usersID}, (err, pointdata) => {
        if(err) 
            return cb(err, null);
        if(pointdata)
            return cb(null, pointdata.points);
        else
            return cb(null, null);
    })
}

//call this function  whenever you need to access values for pointdata.points
/*
howManyPoints(usersID, (err, points) => {
    if(err)
        console.log(err);
    else if(points){
        //Do stuff here
        return points;
    }
    else
        console.log("No data found with the given id");  
})
*/     

/**
 * Sends embed message and awards points to all users mentioned
 * @param {Object} msg - the original command message
 * @param {array} allUsersID - array of user IDs
 * @param {array} allUsersName - array of usernames
 * @param {number} score - the amount of points to be added
 */
function thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${`${msg.author}`} has thanked ${`${numUsers}`} users!`);
    
    for (var i = 0; i < allUsersName.length; i++){
        embedMsg.addField(`${allUsersName[i]}`, "+" + `${score}`, true);
        thank(allUsersID[i], allUsersName[i], score);
    }
    msg.channel.send(embedMsg);
}

/**
 * Sends embed message and awards points to the user mentioned
 * @param {Object} msg - the original command message
 * @param {string} usersID - a single user's ID
 * @param {string} usersName - a single user's username
 * @param {number} score - the amount of points to be added
 */
function thankOnlyOne(msg, usersID, usersName, score) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${msg.author}` + ' has thanked 1 user!')
    .addField(`${usersName}`, "+" + `${score}`, true);

    thank(usersID, usersName, score);
    msg.channel.send(embedMsg);
}

/**
 * Sends embed message on how to use the command properly
 * @param {Object} msg - the original command message
 */
function incorrectUsage(msg) {

    const embedMsg1 = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .addField('Thank one person', '\`-thanks <user>\`', false)
    .addField('Thank more than one person', '\`-thanks <user1> <user2> <user3>\`', false)
    .setFooter('Do not include < and >. Use @','');
    msg.channel.send(embedMsg1);
}

module.exports = {
    name: 'thanks',
    description: "this command stores awards points",
    execute (msg, args){

        //When argument doesnt exist, or not all command arguments are mentions
        if (!args.length || !isAllMentions(args)) {
            incorrectUsage(msg);
        }
        else {
            //Uncomment this if you want the user's comment to be deleted
            //message.delete(); 

            const numUsers = args.length;
            const score = Math.floor(500/(Math.pow(numUsers, 0.7)));
                
            //An array of user IDs (ie <@189549341642326018>)
            const allUsersID = msg.mentions.users.array();    

            //An array of user names (ie chendumpling)
            const allUsersName = idToName(allUsersID);

            //More than one user being thanked
            if (numUsers > 1){

                //Make sure there are no duplicated mentions
                if (getDuplicateArrayElements(args)) {
                    msg.channel.send('Please thank each user only once');
                }
                else {
                    thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score);
                }
            }

            //Only one user being thanked
            else {
                thankOnlyOne(msg, allUsersID[0], allUsersName[0], score);
            }
        }
    }
}
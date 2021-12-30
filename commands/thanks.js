const Discord = require('discord.js');
const mongoose = require('mongoose');
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const pointsAdd = require("../models/addPoints.js");
const secrets = require(`../secrets.json`);
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Checks if user is thanking themselves
 * @param {Object} msg - the original command message
 * @param {Array} arr - array of user IDs
 * @return {Boolean} true if array has one mention matching the sending user's ID
 */
function checkIfThankThemself(msg, arr) {

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == msg.author) { // ex: if('912373' == 912373)
            return true;
        }
    }
    return false;
}
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
 * and adds points to the message author.
 * If their data doesn't exist, it is made.
 * @param {Object} msg - the original command message
 * @param {string} usersID - a single user's ID
 * @param {number} score - the amount of points to be added
 */
function thank (msg, usersID, score) {
    
    // Removes nickname ! in ID
    usersID = String(usersID).replace('!','');
    
    pointsAdd.findOne({userid: usersID}, (err, pointdata) => {
        if(err) console.log(err);
        if(!pointdata){
            const addPoints = new pointsAdd({
                userid: usersID,
                points: score
            })
            addPoints.save().catch(err => console.log(err));
        } else {
            pointdata.points = pointdata.points + score;
            pointdata.save().catch(err => console.log(err));
        }
    })

    let scorePortion = Math.ceil(score*0.2);

    pointsAdd.findOne({userid: msg.author}, (err, pointdata) => {
        if(err) console.log(err);
        if(!pointdata){
            const addPoints = new pointsAdd({
                userid: msg.author,
                points: scorePortion
            })
            addPoints.save().catch(err => console.log(err));
        } else {
            pointdata.points = pointdata.points + score;
            pointdata.save().catch(err => console.log(err));
        }
    })
}

/**
 * Sends embed message and awards points to all users mentioned
 * @param {Object} msg - the original command message
 * @param {array} allUsersID - array of user IDs
 * @param {array} allUsersName - array of usernames
 * @param {number} score - the amount of points to be added
 */
function thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#2ecc71')
    .setDescription(`${`${msg.author}`} has thanked ${`${numUsers}`} users!`);
    
    var count = 0;

    for (var i = 0; i < allUsersName.length; i++){
        embedMsg.addField(`${allUsersName[i]}`, "+" + `${score}`, true);
        thank(msg, allUsersID[i], score);
        count++
    }

    let scorePortion = Math.ceil(score*0.2*count);

    embedMsg.addField(`${msg.author.username}`, "+" + `${scorePortion}`, true);

    msg.channel.send({embeds: [embedMsg]});
}

/**
 * Sends embed message and awards points to the user mentioned
 * @param {Object} msg - the original command message
 * @param {string} usersID - a single user's ID
 * @param {string} usersName - a single user's username
 * @param {number} score - the amount of points to be added
 */
function thankOnlyOne(msg, usersID, usersName, score) {

    let scorePortion = Math.ceil(score*0.2);

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#2ecc71')
    .setDescription(`${msg.author}` + ' has thanked 1 user!')
    .addField(`${usersName}`, "+" + `${score}`, true)
    .addField(`${msg.author.username}`, "+" + `${scorePortion}`, true);

    thank(msg, usersID, score);
    msg.channel.send({embeds: [embedMsg]});
}

/**
 * Sends embed message on how to use the command properly
 * @param {string} prefix - the prefix of the command
 * @param {Object} msg - the original command message
 */
function incorrectUsage(prefix, msg) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#f51637')
    .addField('Thank one user', `\`${prefix}thanks <user>\``, false)
    .addField('Thank multiple users', `\`${prefix}thanks <user1> <user2> <user3>\``, false)
    .addField('Careful', 'Do not include < and >. Use @', false);
    msg.channel.send({embeds: [embedMsg]});
}

module.exports = {
    name: 'thanks',
    description: "this command stores awards points for one or multiple users",
    
    execute (prefix, msg, args){
        
        var hasThanked = Boolean(false);
        //When argument command doesnt have any arguments, 
        //or not all command arguments are mentions
        if (!args.length || !isAllMentions(args)) {
            incorrectUsage(prefix, msg);
        }
        else {
            //Uncomment this if you want the user's comment to be deleted
            //msg.delete(); 

            const numUsers = args.length;
            const score = Math.ceil(100/(Math.pow(numUsers, 0.5)));
                
            //An map of user IDs (ie <@189549341642326018>)
            const allUsersID = [...msg.mentions.users.values()];    

            //An array of user names (ie chendumpling)
            const allUsersName = idToName(allUsersID);
            
            //User is thanking themselves
            if (checkIfThankThemself(msg, allUsersID)){
                msg.channel.send("You cannot thank yourself.");
            }

            //More than one user being thanked
            else if (numUsers > 1){

                //Make sure there are no duplicated mentions
                if (getDuplicateArrayElements(args)) {
                    msg.channel.send('Please thank each user only once');
                }
                else {
                    thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score);
                    hasThanked = true;
                }
            }

            //Only one user being thanked
            else {
                thankOnlyOne(msg, allUsersID[0], allUsersName[0], score);
                hasThanked = true;
            }
        }
        return hasThanked;

    }
}
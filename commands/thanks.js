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

//Returns true if a name is mentioned more than once in the command
function getDuplicateArrayElements(arr){
    var sorted_arr = arr.slice().sort();
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            return true;
        }
    }
    return false;
}

function getUserFromMention(mention) {
    if (!mention) return;
    
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    }
    return false;
}

//Returns false if there is at least one command that isn't a mention
function isAllMentions(arr){
    
    for (var i = 0; i < arr.length; i++) {
        
        if (!getUserFromMention(arr[i])) {
            return false;
        }
    }
    return true;
}

function idToName(arr){
    const result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i].username;
    }
    return result;
}

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

//return cb function withf irst parameter as error if occured
//and second parameters is points
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
        else if(points)
            return points;
        else
            console.log("No data found with the given id");  
})

*/     

function thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score) {

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${`${msg.author}`} has thanked ${`${numUsers}`} users!`);

    //Add score to different users
    for (var i = 0; i < numUsers; i++){
        embedMsg.addField(`${allUsersName[i]}`, "+" + `${score}`, true);
        thank(allUsersID[i], allUsersName[i], score);
    }
    msg.channel.send(embedMsg);
}

function thankOnlyOne(msg, usersID, usersName, score) {

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${msg.author}` + ' has thanked 1 user!')
    .addField(`${usersName}`, "+" + `${score}`, true);
    thank(usersID, usersName, score);
    msg.channel.send(embedMsg);
}

function incorrectUsage(msg) {

    //Send embed message
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

            //message.delete(); //Uncomment this if you want the user's comment to be deleted

            const numUsers = args.length;
            const score = Math.floor(500/(Math.pow(numUsers, 0.7)));
                
            //An array of user IDs (ie 189549341642326018)
            const allUsersID = msg.mentions.users.array();    

            //An array of user names (ie chendumpling)
            const allUsersName = idToName(allUsersID);

            //More than one user being thanked
            if (numUsers > 1){

                //Make sure there are no duplicates 
                if (getDuplicateArrayElements(args)) {
                    msg.channel.send('Please do not thank the same person twice');
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
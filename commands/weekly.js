const Discord = require('discord.js');
const mongoose = require('mongoose');
const ids = require(`../ids.json`);
const { allowedNodeEnvironmentFlags } = require('process');
const updateWeekly = require("../models/weeklyUpdate.js");
const secrets = require(`../secrets.json`);
var tools = require(`../tools/functions.js`);
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Deletes message and sends a disappearing message telling user how to use the command
 * @param {Message} msg - the original command message
 */
function incorrectSubmit(msg){

    msg.channel.send(`**${msg.author}**` + ", your submission must include an attachment or link.")
    .then(sentMsg => {
        tools.deleteMsg(sentMsg, 10);
        tools.deleteMsg(msg, 10);
    }).catch();
}

function incorrectUsage(prefix, msg) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor(ids.incorrectUsageColor)
    .addField(`\`${prefix}w submit <link/file>\``, 'Submit weekly', false)
    .addField(`\`${prefix}w info\``, 'Check deadline', false)
    .addField(`\`${prefix}w profile\``, 'View your profile', false)
    .addField(`\`${prefix}w profile <user>\``, 'View someone else\'s profile', false)
    msg.channel.send({embeds: [embedMsg]})
    .then(sentMsg => {
        tools.deleteMsg(sentMsg, 15);
        tools.deleteMsg(msg, 15);
    }).catch();
}

function updateProfile(msg) {

    let dateToday = new Date();
    updateWeekly.findOne({userid: msg.author.id}, (err, submitdata) => {
        if(err) console.log(err);
        if(!submitdata){
            tools.createWeeklydata(updateWeekly, msg.author.id, dateToday);
        } else {
            tools.updateWeeklydata(submitdata, dateToday);
        }
    })
    msg.react('✅');
}

function weeklySubmit(msg){

    let hasAttach = msg.attachments.size > 0;
    let hasLink = msg.content.includes('https://' || 'http://' || 'youtube.com' || 'youtu.be');

    // message is valid (contains attachment or link)
    if (hasAttach || hasLink) {
        updateProfile(msg); 
    }

    // When the message does not contain and attachment nor link
    else {
        incorrectSubmit(msg);
    }
}

function weeklyInfo(msg){

    // Current time
    let dateToday = new Date();
    let datetimeToday = dateTimeString(dateToday);

    // This week's deadline
    let deadline = setDeadline(dateToday, 6);
    deadline.setHours(23, 59);
    let datetimeDeadline = dateTimeString(deadline);

    // how many seconds before deadline
    let timeLeft = (deadline.getTime() - dateToday.getTime()) / 1000;

    // send embedded msg with all the date / time info.
    const embedMsg = new Discord.MessageEmbed()
    .setColor(ids.transparentColor)
    .addField(`Current time`, `${datetimeToday}`, false)
    .addField(`Next finalization`, `${datetimeDeadline}`, false)
    .addField(`Time remaining`, `${secondsToDHM(timeLeft)}`, false);
    msg.channel.send({embeds: [embedMsg]});
}

function dateTimeString(datetime){
    let date = datetime.toISOString().split('T')[0];
    let time = datetime.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    });
    return `${time} EST ${date}`;
}

// converts seconds to a string that says N days, N hours, N minutes
function secondsToDHM(timeLeft) {

    let days = Math.floor(timeLeft/86400);
    timeLeft -= days*86400;

    let hours = Math.floor(timeLeft/3600) % 24;
    timeLeft -= hours*3600;

    let minutes = Math.floor(timeLeft/60) % 60;
    timeLeft -= minutes*60;

    return `${days} days, ${hours} hours, ${minutes} minutes`;
}

// finds the date of next Sunday (0-6, sunday is 0)
// Next deadline is the following Sunday 11:59 PM
function setDeadline(date, dayOfWeek) {
    date = new Date(date.getTime ());
    date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
    return date;
}

function weeklyProfile(bot, msg, args){

    // -w profile @user
    if(args.length === 2 && args[1].startsWith('<@') && args[1].endsWith('>')){
        let thisUser = msg.mentions.members.first();
        makeProfile(bot, msg, thisUser);
    }
    // -w profile
    else {
        //msg.member (guildmember) is the same as msg.author (user)
        let thisUser = msg.member; 
        makeProfile(bot, msg, thisUser);
    }
}

function makeProfile(bot, msg, thisUser){

    const embedMsg = new Discord.MessageEmbed()
    .setColor(ids.thanksColor)
    .setAuthor({ 
        name: `Profile for ${thisUser.user.username}`, 
    })
    .setThumbnail(thisUser.user.avatarURL());

    updateWeekly.findOne({userid: thisUser.id}, (err, submitdata) => {
        
        if(err) console.log(err);
        
        if(!submitdata){
            msg.channel.send(`**${thisUser.user.username}** does not have a profile! They will get one when they submit a weekly for the first time.`);
        } 
        else {
            // Display currentRole in embed
            let currentRole = getCurrentRole(bot, thisUser);
            let showCurRole = "None";
            if (currentRole != undefined){
                showCurRole = currentRole;
            }
            embedMsg.setDescription(`Rank: ${showCurRole}`); 
            
            // Show submission history
            let showThisWeek = `No submission`;
            let showLastWeek = `No submission`;
            // console.log(submitdata.thisWeek)
            // console.log(submitdata.lastWeek)

            if (submitdata.thisWeek != undefined){
                showThisWeek = dateTimeString(submitdata.thisWeek);
            }
            if (submitdata.lastWeek != undefined){
                showLastWeek = dateTimeString(submitdata.lastWeek);
            }
            embedMsg.addField(`Submissions`, `This week: ${showThisWeek}\nLast week: ${showLastWeek}`, false); 

            // Show streaks
            embedMsg.addField(`Current streak`, `${submitdata.streak}`, true); 
            embedMsg.addField(`Highest streak`, `${submitdata.highestStreak}`, true); 

            // send message
            msg.channel.send({embeds: [embedMsg]});
        }
    });
}

function getCurrentRole(bot, thisUser){
    
    // retrieves guild object
    let myGuild = bot.guilds.cache.get(ids.serverGuildID);
    let currentRole = undefined;

    // Get current rank of member
    if (thisUser != undefined) {
        
        if(thisUser.roles.cache.some(r => r.name === ids.wRank1)){
            currentRole = myGuild.roles.cache.find(r => r.name === ids.wRank1);
        }
        else if(thisUser.roles.cache.some(r => r.name === ids.wRank2)){
            currentRole = myGuild.roles.cache.find(r => r.name === ids.wRank2);
        }
        else if(thisUser.roles.cache.some(r => r.name === ids.wRank3)){
            currentRole = myGuild.roles.cache.find(r => r.name === ids.wRank3);
        }
    }
    return currentRole;
}

module.exports = {
    name: 'weekly',
    description: "this command submits an entry to the weekly counter",
    execute (bot, prefix, msg, args){
    
        switch(true) {
            case args[0] === "submit":
                weeklySubmit(msg, args);
                break;
            case args[0] === "info":
                weeklyInfo(msg);
                break;
            case args[0] === "profile":
                weeklyProfile(bot, msg, args);
                break;
            default:
                incorrectUsage(prefix, msg);
                break;
        }
    }
}
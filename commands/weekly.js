const Discord = require('discord.js');
const mongoose = require('mongoose');
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
    msg.delete()
    msg.channel.send(`**${msg.author.username}**` + ", your submission must include an attachment or link.")
    .then(sentMsg => {
        tools.deleteMsg(sentMsg, 10);
    }).catch();
}

function incorrectUsage(prefix, msg) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#f51637')
    .addField('Submit weekly', `\`${prefix}w submit <link/file>\``, false)
    .addField('Check deadline', `\`${prefix}w info\``, false)
    .addField('View your profile', `\`${prefix}w profile\``, false)
    .addField('View someone else\'s profile', `\`${prefix}w profile <user>\``, false)
    msg.channel.send({embeds: [embedMsg]})
    .then(sentMsg => {
        tools.deleteMsg(sentMsg, 15);
        tools.deleteMsg(msg, 15);
    }).catch();
}

function updateProfile(msg) {



    const dateToday = new Date();
    
    // this date needs to be BEFORE 1st submission to award role
    let dateWeekAgo = new Date();

    // dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);
    // let diffInTime = dateToday.getTime() - dateWeekAgo.getTime();
    // // diffInTime is is set to milliseconds, so convert that to days
    // let diffInDays = diffInTime / (1000 * 3600 * 24);
    
    // msg.channel.send(dateToday.toString());
    // msg.channel.send(dateWeekAgo.toString()); 
    // msg.channel.send("dateToday - dateWeekAgo = " + diffInDays); 

    // add this weeks submission into schema
    updateWeekly.findOne({userid: msg.author.id}, (err, submitdata) => {
        if(err) console.log(err);
        if(!submitdata){
            tools.createWeeklydata(updateWeekly, msg.author.id, dateToday);
        } else {
            tools.updateWeeklydata(submitdata, dateToday);
        }
        //console.log(dateToday);
    })
}

function weeklySubmit(msg, args) {

    let hasAttach = msg.attachments.size > 0;
    let hasLink = msg.content.includes('https://' || 'http://' || 'youtube.com' || 'youtu.be');

    // message is valid (contains attachment or link)
    if (hasAttach || hasLink) {
        // Dont need thread, just make mod command where mods can
        // invalidate current week user's submission with +w invalid @user
        // which would move last week user's submission to current
        // and lastLastWeek to lastweek.
        // the weeklyUpdate schema will have a "previous submission"
        // that the mods can rollback to.
        updateProfile(msg); 
    }

    // When the message does not contain and attachment nor link
    else {
        incorrectSubmit(msg);
    }
}

module.exports = {
    name: 'weekly',
    description: "this command submits an entry to the weekly counter",
    execute (prefix, msg, args){
    
        switch(true) {
            case args[0] === "submit":
                weeklySubmit(msg, args);
                break;
            case args[0] === "info":
                // Current time HH:MM EST DD/MM/YYYY 
                // Next deadline HH:MM EST DD/MM/YYYY
                // Hrs and Min until next deadline HH:MM
                console.log("in info");
                break;
            case args[0] === "profile":
                // Show in good looking embed message
                // Current role
                // This week's submission: N/A / datetime
                // Last week's submission: N/A / datetime
                // # concurrent weeklies (only if mods say "yes" to thread)
                // if mods say yes to thread, archive thread and 
                console.log("in profile");
                break;
            default:
                //When message is invalid (first arg is not submit, info, profile)
                incorrectUsage(prefix, msg);
                break;
        }
    }
}
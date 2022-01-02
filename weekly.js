const Discord = require('discord.js');
const mongoose = require('mongoose');
const weeklyUpdate = require("../models/weeklyUpdate.js");
const secrets = require(`../secrets.json`);
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// This code is shit and I want to remove it

/**
 * Deletes message and sends a disappearing message telling user how to use the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(msg){
    msg.delete()
    msg.channel.send(`**${msg.author.username}**` + ", your submission must include an attachment or link.")
    .then(sentMsg => {
        setTimeout(() => sentMsg.delete(), 10000)
    }).catch();
}

module.exports = {
    name: 'weekly',
    description: "this command submits an entry to the weekly counter",
    execute (msg){
        
        let hasAttach = msg.attachments.size > 0;
        let hasLink = msg.content.includes('https://' || 'http://' || 'youtube.com' || 'youtu.be');

        // message is valid (contains attachment or link)
        if (hasAttach || hasLink) {
            
            const dateToday = new Date();

            // this date needs to be BEFORE 1st submission to award role
            let dateWeekAgo = new Date();
            dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);

            console.log(dateToday);
            console.log(dateWeekAgo); 
        }

        // When the message does not contain and attachment nor link
        else {
            incorrectUsage(msg);
        }
    }
}
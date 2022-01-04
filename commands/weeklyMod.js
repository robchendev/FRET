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

// Resets streak to 0 and removes role
function resetProfile(bot, msg, thisUser, roleNames){

    // Access submitdata
}

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

/**
 * Removes all roles in roleNames from the user
 * @param {Array} msg - point thresholds for each role
 * @param {Schema} submitdata - holds submission data
 * @param {Array} roleNames - roles to be given
 */
 function repairRoles(msg, submitdata, roleNames){
    
    // retrieve member object for user
    let user = msg.mentions.members.first();
    if (msg != undefined){
        for (var i = 0; i < roleNames.length; i++){
            if (user.roles.cache.has(roleNames[i].id)){
                user.roles.remove(roleNames[i].id)
            }
        }
    }
}

module.exports = {
    name: 'weeklyMod',
    description: "this command submits an entry to the weekly counter",
    execute (prefix, msg, args){
    
        // Weekly streak roles
        var roleNames = [
            /*0*/myGuild.roles.cache.find(r => r.name === ids.wRank1),
            /*1*/myGuild.roles.cache.find(r => r.name === ids.wRank2),
            /*2*/myGuild.roles.cache.find(r => r.name === ids.wRank3)
        ];

        // make sure passed arg is a mention
        if(args.length === 1 && args[0].startsWith('<@') && args[0].endsWith('>')){
            let thisUser = msg.mentions.members.first();
            resetProfile(bot, msg, thisUser, roleNames);
        }
        else {
            incorrectUsage(prefix, msg);
        }
    }
}
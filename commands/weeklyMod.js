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
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
 function incorrectUsage(prefix, msg){
    const embedMsg = new Discord.MessageEmbed()
    .setColor(ids.incorrectUsageColor)
    .addField(`\`${prefix}w reset <user>\``, 'Reset streak and rank', false);
    msg.channel.send({embeds: [embedMsg]})
    .then(sentMsg => {
        tools.deleteMsg(sentMsg, 10);
        tools.deleteMsg(msg, 10);
    }).catch();
}

// Resets streak to 0 and removes role
function resetProfile(msg, thisUser, roleNames){

    updateWeekly.findOne({userid: thisUser.id}, (err, submitdata) => {
        if(err) console.log(err);
        if(!submitdata){
            msg.channel.send(`**${thisUser.user.username}** does not have a profile.`);
        } 
        else {
            resetStreak(submitdata);
            repairRoles(msg, roleNames);
            const embedMsg = new Discord.MessageEmbed()
            .setColor(ids.dataChangeColor)
            .setDescription(`${thisUser}'s streaks and rank have been reset.`);
            msg.channel.send({embeds: [embedMsg]});
        }
    });
}

/**
 * Removes all roles in roleNames from the user
 * @param {Array} msg - point thresholds for each role
 * @param {Schema} submitdata - holds submission data
 * @param {Array} roleNames - roles to be given
 */
 function repairRoles(msg, roleNames){
    
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

function resetStreak(submitdata){
    submitdata.streak = 0;
}

module.exports = {
    name: 'weeklyMod',
    description: "this command submits an entry to the weekly counter",
    execute (bot, prefix, msg, args){
    
        // retrieves guild object
        let myGuild = bot.guilds.cache.get(ids.serverGuildID);

        // Weekly streak roles
        var roleNames = [
            /*0*/myGuild.roles.cache.find(r => r.name === ids.wRank1),
            /*1*/myGuild.roles.cache.find(r => r.name === ids.wRank2),
            /*2*/myGuild.roles.cache.find(r => r.name === ids.wRank3)
        ];

        // make sure passed arg is a mention
        if(args.length === 2 && args[1].startsWith('<@') && args[1].endsWith('>')){
            let thisUser = msg.mentions.members.first();
            resetProfile(msg, thisUser, roleNames);
        }
        else {
            incorrectUsage(prefix, msg);
        }
    }
}
const Discord = require('discord.js');
const ids = require(`../ids.json`);

function incorrectUsage(msg){

    msg.delete()
    msg.channel.send(`**Correct usage:** \`+i #channelName <message>\``)
    .then(sentMsg => {
        setTimeout(() => sentMsg.delete(), 10000)
    }).catch();
}

module.exports = {
    name: 'impersonate',
    description: "this command gives a moderator remote message-control of the bot. This bot is not listed in help because other people may see it, and that would spoil the fun.",
    execute (bot, msg, args){

        // Command usage: +impersonate #randomchannel text here

        // get numbers from the channel ID (don't want <#...>) 
        let targetChannel = args[0].replace(/\D/g, "");
        let result = "";

        // Does the mentioned channel actually exist
        if(bot.channels.cache.get(targetChannel) != undefined){

            // Construct message to be sent
            for (let i = 1; i < args.length; i++){
                result = result + args[i] + " ";
            }

            // Send the message as FretBot
            bot.channels.cache.get(targetChannel).send(result);
        }
        else {
            incorrectUsage(msg);
        }

    }
}
const Discord = require('discord.js');
const ids = require(`../ids.json`);

function incorrectUsage(msg){
    msg.channel.send(`**Correct usage:** \`#channelName <message>\`\nThis channel is for sending messages as FretBot only.`);
}

function missingPermissions(msg, targetChannel){
    msg.channel.send(`**[ERR]** Missing access to channel <#${targetChannel}>`);
}

module.exports = {
    name: 'impersonate',
    description: "this command gives a moderator remote message-control of the bot. This bot is not listed in help because other people may see it, and that would spoil the fun.",
    execute (bot, msg){

        const args = msg.content.split(/ +/);
        // get numbers from the channel ID (don't want <#...>) 
        let targetChannel = args[0].replace(/\D/g, "");
        let result = "";

        // Does the mentioned channel actually exist
        if(bot.channels.cache.get(targetChannel) != undefined
            && msg.guild.me.permissionsIn(targetChannel).has("SEND_MESSAGES")
            && msg.guild.me.permissionsIn(targetChannel).has("VIEW_CHANNEL")){

            // Construct message to be sent
            for (let i = 1; i < args.length; i++){
                result = result + args[i] + " ";
            }

            // Send the message as FretBot
            bot.channels.cache.get(targetChannel).send(result);
            msg.react('✅');
        }
        // earlier this was giving a GUILD_CHANNEL_RESOLVE error
        // because no checks were done to ensure the targetChannel is
        // actually an existing channel.
        else if(bot.channels.cache.get(targetChannel) != undefined 
            && (!msg.guild.me.permissionsIn(targetChannel).has("SEND_MESSAGES")
            || !msg.guild.me.permissionsIn(targetChannel).has("VIEW_CHANNEL"))){

                missingPermissions(msg, targetChannel);
        }
        else {
            incorrectUsage(msg);
        }
    }
}
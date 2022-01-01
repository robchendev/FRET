const Discord = require('discord.js');

/**
 * Creates a thread using the original message author's username
 * @param {Message} msg - the original command message
 */
function createThread(msg){
    
    let threadTitle = msg.author.username + " - Discussion";
    msg.startThread({
        name: threadTitle,
        autoArchiveDuration: 60
    });
}

/**
 * Sends embed message on how to use the command properly
 * @param {Message} msg - the original command message
 */
function incorrectUsage(msg){

    if(msg.content.includes('discord.gg')){
        msg.delete()
        msg.channel.send(`**${msg.author.username}**` + ", discord invite links are not allowed in promotion.")
        .then(sentMsg => {
            setTimeout(() => sentMsg.delete(), 7000)
        }).catch();
    }
    else {
        msg.delete()
        msg.channel.send(`**${msg.author.username}**` + ", your promotion must include a link.")
        .then(sentMsg => {
            setTimeout(() => sentMsg.delete(), 7000)
        }).catch();
    }
}

module.exports = {
    name: 'promo',
    description: "this command is passively invoked whenever a user sends a message into the promotion channel.",
    execute (msg){

        // Makes sure this command only runs outside of threads
        if (!(msg.channel.type == 'GUILD_PUBLIC_THREAD')){

            let hasLink = msg.content.includes('https://' || 'http://');

            // message contains valid link
            if (hasLink) {
                createThread(msg);
            }

            // When the message does not contain a  link
            else {
                incorrectUsage(msg);
            }
        }
    }
}
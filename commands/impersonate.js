/**
 * Constructs the message to be sent
 * @param {Array} args - the message, stored as an array of words
 * @return {String} the constructed message
 */
function constructMsg(args) {
    let result = "";
    for (let i = 1; i < args.length; i++) {
        result += args[i] + " ";
    }
    return result;
}

/**
 * Sends the constructed message to the target channel, then reacts to
 * the original message to show constructed message was sent successfully
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Message} msg - the original message
 * @param {String} targetChannel - ID of the channel to send to
 * @param {String} result - the message to be sent
 */
function sendAndReact(bot, msg, targetChannel, result) {
    bot.channels.cache.get(targetChannel).send(result);
    msg.react("✅");
}

/**
 * Sends the correct usage of '+imp' in the channel user invoked the command
 * @param {Message} msg - the original message
 * @param {String} targetChannel - ID of the channel to send to
 */
function incorrectUsage(msg) {
    msg.channel.send(
        `**Correct usage:** \`#channelName <message>\`\nThis channel is for sending messages as FretBot only.`
    );
}

/**
 * Sends an error message in the channel which user invoked the command in
 * @param {Message} msg - the original message
 * @param {String} targetChannel - ID of the channel to send to
 */
function missingPermissions(msg, targetChannel) {
    msg.channel.send(`**[ERR]** Missing access to <#${targetChannel}>`);
}

/**
 * Returns true if the target channel exists and bot has permissions
 * @param {Message} msg - the original message
 * @param {String} targetChannel - ID of the channel to send to
 * @return {Boolean} 
 */
function checkChannelPermissions(bot, msg, targetChannel) {
    return (
        bot.channels.cache.get(targetChannel) != undefined &&
        msg.guild.me.permissionsIn(targetChannel).has("SEND_MESSAGES") &&
        msg.guild.me.permissionsIn(targetChannel).has("VIEW_CHANNEL")
    );
}

/**
 * Returns true if the target channel exists but bot does not have permissions
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * @param {Message} msg - the original message
 * @param {String} targetChannel - ID of the channel to send to
 * @return {Boolean} 
 */
function checkMissingPermissions(bot, msg, targetChannel) {
    return (
        bot.channels.cache.get(targetChannel) != undefined &&
        (!msg.guild.me.permissionsIn(targetChannel).has("SEND_MESSAGES") ||
            !msg.guild.me.permissionsIn(targetChannel).has("VIEW_CHANNEL"))
    );
}

module.exports = {
    name: "impersonate",
    description:
        "this command gives a moderator remote message-control of the bot. This bot is not listed in help because other people may see it, and that would spoil the fun.",
    execute(bot, msg) {
        // get numbers from the channel ID (don't want <#...>)
        const args = msg.content.split(/ +/);
        let targetChannel = args[0].replace(/\D/g, "");

        // Does the mentioned channel actually exist
        if (checkChannelPermissions(bot, msg, targetChannel) === true) {
            resultToSend = constructMsg(args);
            sendAndReact(bot, msg, targetChannel, resultToSend);
        } else if (checkMissingPermissions(bot, msg, targetChannel) === true) {
            missingPermissions(msg, targetChannel);
        } else {
            incorrectUsage(msg);
        }
    },
};

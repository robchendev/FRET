module.exports = {
    /**
     * Deletes the specified message (whether by user or by FretBot), after the specified amount of time, while handling any errors.
     * @param {Message} message - The message that should be deleted.
     * @param {Number} delayInSeconds - The amount of time that should elapse prior to deleting the message.
     */
    deleteMessage: function (message, delayInSeconds) {
        setTimeout(() => {
            message.delete().catch((error) => console.error(error));
        }, delayInSeconds * 1000);
    },
    /**
     * Sends the standardized command usage message embed in response to a specified message.
     * @param {DiscordMessage} message - The message to 
     * @param {String} prefix 
     * @param {String} commandKey 
     * @param {String} syntax 
     * @param {DiscordEmbedFieldArray} fields - The fields 
     * @param {Number} destroyIn - The number of seconds to wait before destroying the usage and triggering messages.
     */
    sendCommandUsageMessage(message, prefix, commandKey, syntax, fields, destroyIn) {
        const embed = new Discord.MessageEmbed()
            .setColor(ids.dataChangeColor)
            .setTitle(`Correct Usage for \`${prefix}${commandKey}\``)
            .setDescription(`The syntax for the \`${prefix}${commandKey}\` command is: \`\`\`${syntax}\`\`\`.`)
            .addFields(fields)
            .setFooter({ text: `This message will self destruct in ${destroyIn} seconds.` })
            .setTimestamp();
        message.channel.send({ embeds: [embed] })
            .then((sentMessage) => {
                this.deleteMessage(sentMessage, destroyIn);
                this.deleteMessage(message, destroyIn);
            })
            .catch((error) => { console.error(error); });
    }
};
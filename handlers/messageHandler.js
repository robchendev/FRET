const config = require(`../config.json`);
module.exports = {
    invokingModule: undefined,
    /**
     * Registers the specified module as the invoking module of the handler.
     * @param {Module} module The module to register with the handler.
     */
    register: function(module) { this.invokingModule = module; },
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
     * @param {DiscordMessage} message - The message this embed is in response of.
     */
    sendCommandUsageMessage(message) {
        let prefix = this.invokingModule.isModeratorCommand ? config.moderatorPrefix : config.userPrefix;
        let commandKey = this.invokingModule.key;
        let syntax = this.invokingModule.syntax;
        let fields = this.invokingModule.fieldDescriptions;
        let lifetime = config.correctUsageMessageLifetimeInSeconds;
        const embed = new Discord.MessageEmbed()
            .setColor(ids.dataChangeColor)
            .setTitle(`Correct Usage for \`${prefix}${commandKey}\``)
            .setDescription(`The syntax for the \`${prefix}${commandKey}\` command is: \`\`\`${syntax}\`\`\`.`)
            .addFields(fields)
            .setFooter({ text: `This message will self destruct in ${destroyIn} seconds.` })
            .setTimestamp();
        message.channel.send({ embeds: [embed] })
            .then((sentMessage) => {
                this.deleteMessage(sentMessage, lifetime);
                this.deleteMessage(message, lifetime);
            })
            .catch((error) => { console.error(error); });
    }
};
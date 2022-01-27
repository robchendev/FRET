const Discord = require("discord.js");
const configHandler = require(`../handlers/configurationHandler.js`);
configHandler.initialize();

var tools = require(`../tools/functions.js`);

/**
 * Creates a thread using the original message's question.
 * @param {Message} msg - the original command message
 */
async function createThread(msg) {
    // The bot crashes if the title is longer than 100 characters,
    // this gives some headroom.
    let threadTitle = msg.author.username + " - Discussion";
    if (msg.content > 83) {
        threadTitle = threadTitle + "...";
    }
    const thread = await msg.startThread({
        name: threadTitle,
    });
    thread.send(`${msg.author.username} has successfully submitted their competition entry.`);
}

/**
 * Sends embed message on how to use the command properly
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function incorrectUsage(prefix, msg) {
    let time = 10;
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.incorrectUsageColor)
        .addField("Correct format", `\`${prefix}c <YouTube link>\``, false);
    msg.channel
        .send({ embeds: [embedMsg] })
        .then((sentMsg) => {
            tools.deleteMsg(msg, time);
            tools.deleteMsg(sentMsg, time);
        })
        .catch();
}

/**
 * Sends embed message on how to use the command properly. Similar to
 * incorrectUsage, but invoked when user message has no arguments
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function noArgs(prefix, msg) {
    let time = 10;
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.incorrectUsageColor)
        .addField("Correct format", `\`${prefix}c <YouTube link>\``, false);
    msg.channel
        .send({ embeds: [embedMsg] })
        .then((sentMsg) => {
            tools.deleteMsg(sentMsg, time);
            tools.deleteMsg(msg, time);
        })
        .catch();
}

module.exports = {
    name: "competition",
    description:
        "this command is passively invoked whenever a user sends a message into the competition channel. It ensures that all the messages sent start with a '-c' and creates threads for them.",
    execute(prefix, prefixMod, msg) {
        // Makes sure this command only runs outside of threads
        if (
            !(msg.channel.type == "GUILD_PUBLIC_THREAD") &&
            !(msg.channel.type == "GUILD_PRIVATE_THREAD")
        ) {
            
            if (msg.content.startsWith(prefix) && !msg.author.bot) {
                //Splices via space (ie "-thanks @robert")
                const withoutPrefix = msg.content.slice(prefix.length);
                const split = withoutPrefix.split(/ +/);
                const command = split[0];
                const args = split.slice(1);
                //if command === c and is a youtube link
                if (command === "c" 
                && msg.content.includes("https://" || "http://") 
                && msg.content.includes("youtu.be" || "youtube.com")) {
                    if (!args.length) noArgs(prefix, msg);
                    else createThread(msg);
                }
                else {
                    incorrectUsage(prefix, msg);
                }
            } 
            else if (msg.content.startsWith(prefixMod)) {
                //do nothing
                return;
            }
            else {
                incorrectUsage(prefix, msg);
            }
        }
    },
};

const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();

var tools = require(`../../tools/functions.js`);

/**
 * Creates a thread using the original message author's username
 * @param {Message} msg - the original command message
 */
async function createThread(msg) {
    let threadTitle = msg.author.username + " - Discussion";
    const thread = await msg.startThread({
        name: threadTitle,
        autoArchiveDuration: 60,
    });
    thread.send(`Show ${msg.author.username} some support!`);
}

/**
 * Sends embed message on how to use the command properly
 * @param {Message} msg - the original command message
 */
function incorrectUsage(msg) {
    let time = 15;
    msg.channel
    .send(
        `**${msg.member}**` +
            `, discussions in <#${configHandler.flux.shareMusicChannel}> are only allowed in threads. If you're sharing your music, include a link or file Your message will be deleted in ${time} seconds. `
    )
    .then((sentMsg) => {
        tools.deleteMsg(sentMsg, time);
        tools.deleteMsg(msg, time);
    })
    .catch();
}

module.exports = {
    name: "shareYourMusic",
    description:
        "this passive command creates threads underneath messages in shareMusicChannel.",
    execute(prefixMod, msg) {
        
        // Makes sure this command only runs outside of threads
        if (
            !(msg.channel.type == "GUILD_PUBLIC_THREAD") &&
            !(msg.channel.type == "GUILD_PRIVATE_THREAD")
        ) {
            // message contains valid link
            if ((msg.attachments.size > 0 || msg.content.includes("https://" || "http://"))) {
                createThread(msg);
            }

            // When the message is a mod command
            else if (msg.content.startsWith(prefixMod)) {
                //do nothing
                return;
            }

            // When the message does not contain a link
            else {
                incorrectUsage(msg);
            }
        }
    },
};

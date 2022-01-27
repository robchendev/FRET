const Discord = require("discord.js");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();

/**
 * '-help' or '-help c'
 * Sends embed message that shows the correct commands to show the
 * command list for the Help Forum and Weekly Submission channels
 * @param {Message} msg - the original command message
 */
function whichCommand(bot, prefix, msg) {
    let weekly = bot.channels.cache.get(configHandler.flux.weeklyChannel);
    let helpForum = bot.channels.cache.get(configHandler.flux.helpForumChannel);
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.incorrectUsageColor)
        .setTitle("Commands")
        .addField(
            `\`${prefix}help f\``,
            `Shows commands for ${helpForum}`,
            false
        )
        .addField(`\`${prefix}help w\``, `Shows commands for ${weekly}`, false)
        .addField(
            `\`${prefix}help i\``,
            `Shows info about ${configHandler.data.botName}`,
            false
        );
    msg.channel.send({ embeds: [embedMsg] });
}

/**
 * '-help f' or '-help' invoked in helpForumChannel
 * Sends embed message on all Help Forum commands
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function showForumCommands(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .setTitle("Help Forum Commands")
        .setDescription(
            `Type \`${prefix}help c\` to commands for other channels`
        )
        .addField(
            `\`${prefix}q <your question>\``,
            "Creates new thread to discuss your question",
            false
        )
        .addField(
            `\`${prefix}thanks <user>\``,
            "Thanks a single user and gives them points",
            false
        )
        .addField(
            `\`${prefix}thanks <user1> <user2> <user3>\``,
            "Thanks multiple users and gives them points",
            false
        )
        .addField(
            `\`${prefix}rankup\``,
            "Ranks you up if you have enough points.",
            false
        )
        .addField(
            `\`${prefix}points\``,
            "Shows how many points you have.",
            false
        )
        .addField(
            `\`${prefix}points <user>\``,
            "Shows a user's points and amount needed for the next rank",
            false
        )
        .addField(`\`${prefix}about\``, "Shows info about this bot", false);
    msg.channel.send({ embeds: [embedMsg] });
}

/**
 * '-help w' or '-help' invoked in weeklyChannel
 * Sends embed message on all Weekly Submission
 * @param {String} prefix - the prefix of the command
 * @param {Message} msg - the original command message
 */
function showWeeklyCommands(prefix, msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .setTitle("Weekly Submission Commands")
        .setDescription(
            `Type \`${prefix}help c\` to commands for other channels`
        )
        .addField(`\`${prefix}w submit <link/file>\``, "Submit weekly", false)
        .addField(`\`${prefix}w info\``, "Check deadline", false)
        .addField(`\`${prefix}w profile\``, "View your profile", false)
        .addField(
            `\`${prefix}w profile <user>\``,
            "View someone else's profile",
            false
        );
    msg.channel.send({ embeds: [embedMsg] });
}

/**
 * '-help i'
 * Sends embed message displaying bot information
 * @param {Message} msg - the original command message
 */
function showBotInfo(msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .setTitle("Github Repository")
        .setURL("https://github.com/chendumpling/FretBot")
        .setDescription(
            configHandler.data.botName +
                ' "Fragile Remains of the Eternal ThankBot" is a multipurpose Javascript Discord bot whose purpose is to encourage discussion in a discord server by facilitating an organized environment and by managing databases to store and retrieve information.'
        )
        .addField("Developer", "Robert Chen", false);
    msg.channel.send({ embeds: [embedMsg] });
}

module.exports = {
    name: "help",
    description: "this command shows embeds for user commands",
    execute(bot, prefix, msg, args) {
        // arg was passed
        
        // -help f
        // -help forums
        // -help forum
        if (args.length === 1 && 
            (args[0] === "f" ||
            args[0] === "forums" ||
            args[0] === "forum")
        ) {
            showForumCommands(prefix, msg);
        }

        // -help w
        // -help weeklies
        // -help weekly
        else if (args.length === 1 && 
            (args[0] === "w" ||
            args[0] === "weeklies" ||
            args[0] === "weekly")
        ) {
            showWeeklyCommands(prefix, msg);
        }

        // -help i
        // -help info
        else if (args.length === 1 && 
            (args[0] === "i" || 
            args[0] === "info")) {
            showBotInfo(msg);
        }

        // -help c
        // -help commands
        else if (args.length === 1 && 
            (args[0] === "c" ||
            args[0] === "commands")) {
            whichCommand(bot, prefix, msg);
        }

        // -help (inside Help Forum)
        else if (msg.channel.id === configHandler.flux.helpForumChannel) {
            showForumCommands(prefix, msg);
        }
        
        // -help (inside Weekly Submissions)
        else if (msg.channel.id === configHandler.flux.weeklyChannel) {
            showWeeklyCommands(prefix, msg);
        }

        // -help (outside both Help Forum and Weekly Submissions)
        else {
            whichCommand(bot, prefix, msg);
        }
    },
};

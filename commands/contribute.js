const Discord = require("discord.js");
const configHandler = require(`../handlers/configurationHandler.js`);
configHandler.initialize();

/**
 * Displays an embed message to show ways to contribute on GitHub
 * @param {String} prefix - the user prefix
 * @param {Message} msg - the original message
 */
function showContribute(msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(configHandler.data.transparentColor)
        .setTitle("Contribute to F.R.E.T.")
        .setDescription(
            "F.R.E.T. is being developed by two people right now, so we really appreciate any help we can get in finding bugs, thinking of new features, and developing."
        )
        .addField(
            "Something not working?",
            "[Report bug](https://github.com/chendumpling/FRET/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D) on GitHub",
            true
        )
        .addField(
            "Want a certain feature?",
            "[Request feature](https://github.com/chendumpling/FRET/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D) on GitHub",
            true
        )
        .addField(
            "Help develop F.R.E.T.",
            "[View open issues](https://github.com/chendumpling/FRET/issues) on GitHub",
            true
        )
        .addField(
            "See the developers",
            "[View contributors](https://github.com/chendumpling/FRET/graphs/contributors) on GitHub",
            true
        );
    msg.channel.send({ embeds: [embedMsg] });
}

module.exports = {
    name: "contribute",
    description: "this command shows an embed for contributions",
    execute(msg) {
        showContribute(msg);
    },
};

const Discord = require("discord.js");
const ids = require(`../config.json`);

/**
 * Displays an embed message to show ways to contribute on GitHub
 * @param {String} prefix - the user prefix
 * @param {Message} msg - the original message
 */
function showContribute(msg) {
    const embedMsg = new Discord.MessageEmbed()
        .setColor(ids.transparentColor)
        .setTitle("Contribute to F.R.E.T.")
        .setDescription(
            "F.R.E.T. is mostly developed by one person right now, so we really appreciate any help we can get in finding bugs, thinking of new features, and developing."
        )
        .addField(
            "Something not working?",
            "[Report bug](https://github.com/chendumpling/F.R.E.T./issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D) on GitHub",
            true
        )
        .addField(
            "Want a certain feature?",
            "[Request feature](https://github.com/chendumpling/F.R.E.T./issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D) on GitHub",
            true
        )
        .addField(
            "Help develop F.R.E.T.",
            "[View open issues](https://github.com/chendumpling/F.R.E.T./issues) on GitHub",
            false
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

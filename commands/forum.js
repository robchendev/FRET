const Discord = require("discord.js");
const { flux } = require("../handlers/configurationHandler.js");
const configHandler = require(`../handlers/configurationHandler.js`);

const pointsAdd = require("../models/addPoints.js");
const { checkIfNeedInitialization } = require("../tools/functions.js");

configHandler.initialize();

var tools = require(`../tools/functions.js`);

/**
 * Sends a reminder to thank people within the thread
 * @param {} thread - the original command thread
 */
async function initializeThread(thread) {
  sendReminder(thread);
  askBounty(thread);
}

async function sendReminder(thread) {
  const embedMsg = new Discord.MessageEmbed()
    .setColor(configHandler.data.transparentColor)
    .setDescription(
      `${thread.guild.members.cache.get(
        thread.ownerId
      )}, make sure you thank the people who answer your question.`
    )
    .addField(`\`-thanks <user>\``, "Thank one user", false)
    .addField(
      `\`-thanks <user1> <user2> <user3>\``,
      "Thank multiple users",
      false
    );
  thread.send({ embeds: [embedMsg] });
}

async function askBounty(thread) {
  pointsAdd.findOne({ userid: `<@${thread.ownerId}>` }, (err, pointdata) => {
    if (err) console.log(err);
    if (!pointdata) {
      tools.createPointdata(pointsAdd, thread.ownerId, 0, 0, 0);
    } else {
      if (pointdata.points) {
        tools.checkIfNeedInitialization(pointdata);
        // This is where the bounty prompt would go
        // once slash commands are ready.
      }
    }
  });
}

module.exports = {
  name: "forum",
  description:
    "this passive command listens for new Help Forum threads being created and sends a reminder in them",
  execute(thread) {
    initializeThread(thread);
  },
};

const Discord = require("discord.js");
const mongoose = require("mongoose");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();
const messageHandler = require(`../../handlers/messageHandler.js`);
const pointHandler = require(`../../handlers/pointHandler.js`);
const pointsChange = require("../../models/addPoints.js");
mongoose.connect(configHandler.secrets.Mongo, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
module.exports = {
  key: "penalty",
  name: "Penalty",
  isModeratorCommand: true,
  description:
    "This command penalizes the specified user by reducing their points by 1,000.",
  syntax: `${configHandler.data.moderatorPrefix}penalty <@user>`,
  fieldDescriptions: [
    {
      name: "`<@user>`",
      value: "This is the mention of the user the command should target.",
    },
  ],
  registerWithHandlers() {
    pointHandler.register(this);
    messageHandler.register(this);
  },
  execute(prefix, msg, args) {
    if (msg.mentions.users.size < 1)
      messageHandler.sendCommandUsageMessage(msg);
    else {
      let userId = String(msg.mentions.users.first()).replace("!", "");
      pointsChange.findOne({ userid: userId }, (findError, pointData) => {
        if (findError !== null) console.error(findError);
        else {
          let pointsUpdated = false;
          let incomingPointData = JSON.parse(JSON.stringify(pointData));
          try {
            if (pointData === null) {
              pointData = pointHandler.createPointDataForUser(
                pointsChange,
                userId,
                0,
                0,
                0
              );
              pointData.points = -1000;
            } else pointData.points -= 1000;

            pointHandler.savePointData(pointData);
            pointsUpdated =
              (incomingPointData === null && pointData !== null) ||
              incomingPointData.points !== pointData.points;
          } catch (error) {
            console.error(error);
          }

          if (pointsUpdated) {
            const embed = new Discord.MessageEmbed()
              .setColor(configHandler.data.dataChangeColor)
              .setDescription(
                `${userId}'s points have been changed to ${pointData.points}`
              );
            msg.channel.send({ embeds: [embed] });
          }
        }
      });
    }
  },
};

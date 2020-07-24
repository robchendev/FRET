const leavechannel = require("../../models/LeaveChannel");

module.exports = {
  name: "leavechannel",
  description: "test",
  category: "test",
  run: async (bot, message, args) => {
    leavechannel.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (err) console.log(err);
      if (!data) {
        let channel = message.guild.channels.cache.find(
          (ch) => ch.name == "leave"
        );
        if (!channel) return;
        let newData = new leavechannel({
          Guild: message.guild.id,
          Channel: channel.id,
          UserID: message.author.id,
        });
        newData.save();
      } else {
        (data.Channel = message.channel.id), data.save();
      }
    });
  },
};
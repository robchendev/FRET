const Discord = require("discord.js");
const configHandler = require(`../handlers/configurationHandler.js`);
configHandler.initialize();

function isThread(msg) {
  return (
    msg.channel.type == "GUILD_PUBLIC_THREAD" ||
    msg.channel.type == "GUILD_PRIVATE_THREAD"
  );
}

function hasAuth(msg) {
  // if user is still at guild
  if (msg.member) {
    // user has Mentor role or above
    return msg.member.roles.cache.some(
      (role) =>
        role.name === configHandler.data.rank3 ||
        role.name === configHandler.data.rank4 ||
        role.name === configHandler.data.rank5 ||
        role.name === configHandler.data.rank6
    );
  }
  return false;
}

function pin(msg) {
  if (msg.reference && msg.pinnable) {
    msg.channel.messages
      .fetch(msg.reference.messageId)
      .then((message) => {
        if (message.pinned) {
          message.unpin();
          msg.reply(`Message unpinned`);
        } else {
          message.pin().catch(() => {
            msg.reply(
              `This channel has too many pins. Unpin a pinned message using \`-pin\` before pinning a new one.`
            );
          });
        }
      })
      .catch(console.error);
  } else {
    msg.reply(
      `Please reply to the message with \`${configHandler.data.userPrefix}pin\` to pin it`
    );
  }
}

module.exports = {
  name: "pin",
  description: "this command pins a message in a thread",
  execute(msg) {
    if (isThread(msg)) {
      if (hasAuth(msg)) {
        pin(msg);
      } else {
        msg.reply(
          `You must have the **${configHandler.data.rank3}** role or above to pin messages`
        );
      }
    } else {
      msg.reply(`This command can only be used in a thread`);
    }
  },
};

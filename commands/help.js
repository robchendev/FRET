const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: "this command shows an embed for all the commands",
    execute (prefix, msg){

    const embedMsg = new Discord.MessageEmbed()
	.setColor('#36393F') //same color as embed background
	.setTitle('Commands')
    .addField(`\`${prefix}thanks @user\``, 'Thanks a single user and gives them points', false)
    .addField(`\`${prefix}thanks @user1 @user2 @user3\``, 'Thanks multiple users and gives them points', false)
    .addField(`\`${prefix}rankup\``, 'Ranks you up if you have enough points. This command might be removed', false)
    .addField(`\`${prefix}points\``, 'Shows your points and amount needed for the next rank', false)
    .addField(`\`${prefix}points @user\``, 'Shows another user\'s points and amount needed for the next rank', false)
    .addField(`\`${prefix}report @user reason\``, 'Reports a user to the mods for abusing the -thanks command', false)
    .addField(`\`${prefix}about\``, 'Shows useless info about this bot (This bot should be renamed \'Gratitude Bot\'', false);

    msg.channel.send(embedMsg);

    }
}
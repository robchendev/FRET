const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: "this command shows an embed for all the commands",
    execute (prefix, msg){

    const embedMsg = new Discord.MessageEmbed()
	.setColor('#2f3136') 
	.setTitle('Commands')
    .addField(`\`${prefix}thanks <user>\``, 'Thanks a single user and gives them points', false)
    .addField(`\`${prefix}thanks <user1> <user2> <user3>\``, 'Thanks multiple users and gives them points', false)
    .addField(`\`${prefix}rankup\``, 'Ranks you up if you have enough points. Otherwise, shows how many points you need to rank up.', false)
    .addField(`\`${prefix}points\``, 'Shows how many points you have.', false)
    .addField(`\`${prefix}points <user>\``, 'Shows a user\'s points and amount needed for the next rank', false)
    .addField(`\`${prefix}about\``, 'Shows useless info about this bot', false);
    
    msg.channel.send(embedMsg);
    }
}
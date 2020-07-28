const Discord = require('discord.js');

module.exports = {
    name: 'helpMod',
    description: "this command shows an embed for all the commands",
    execute (prefix, msg){

    const embedMsg = new Discord.MessageEmbed()
	.setColor('#2f3136') 
	.setTitle('Moderator Commands')
    .addField(`\`${prefix}points <user> inc|dec|set <points>\``, 'Increases, descreases or sets user\'s points', false)
    .addField(`\`${prefix}points <user> pen\``, 'Penalizes a user for 1000 points', false)
    .addField(`\`${prefix}blacklist\``, 'Blacklists user from sending messages on this channel', false)
    
    msg.channel.send(embedMsg);
    }
}
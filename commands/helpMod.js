const Discord = require('discord.js');
const ids = require(`../ids.json`);

module.exports = {
    name: 'helpMod',
    description: "this command shows an embed for moderator commands",
    execute (prefix, msg){

    const embedMsg = new Discord.MessageEmbed()
	.setColor(ids.transparentColor) 
	.setTitle(':small_red_triangle_down: Moderator Commands')
    .addField(`\`${prefix}points <user> inc|dec|set <points>\``, 'Increases, descreases or sets user\'s points', false)
    .addField(`\`${prefix}points <user> pen\``, 'Penalizes user for 1000 points', false)
    .addField(`\`${prefix}w reset <user>\``, 'Resets user\'s weekly streak and rank', false);
    
    msg.channel.send({embeds: [embedMsg]});
    }
}
const Discord = require('discord.js');

module.exports = {
    name: 'about',
    description: "shows bot info (about developer, etc)",
    execute (msg){

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#36393F')
	.setTitle('Some title')
	.setDescription('Some description here')
	.addField('Inline field title', 'Some value here', true)
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    msg.channel.send(embedMsg);

    }
}
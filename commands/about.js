const Discord = require('discord.js');

module.exports = {
    name: 'about',
    description: "shows bot info (about developer, etc)",
    execute (msg){

        const embedMsg = new Discord.MessageEmbed()
        .setColor('#36393F')
        .setTitle('Github Repository')
        .setURL('https://github.com/chendumpling99/ThanksBot')
        .setAuthor('About ThanksBot', '', '')
        .setDescription('ThanksBot is a Javascript bot that stores and manipulates user-awarded points in a database.')
        //.setField('', '', true)
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        .setFooter('Developed by Robert Chen - https://github.com/chendumpling99/', '');




        msg.channel.send(embedMsg);

    }
}
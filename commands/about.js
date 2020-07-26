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
        .setDescription('ThanksBot is a simple Javascript Discord bot that stores user-awarded points in a database (specifically Mongoose). The idea is to encourage users to ask and answer questions. With each question answered, other users can choose to thank the user who answered the question by giving them points, leveling them up through roles.')
        .addField('How points are calculated', 'The expression used is 100/(users^0.5)', false)
        .setFooter('Developed by Robert Chen', '');

        msg.channel.send(embedMsg);
    }
}
const Discord = require('discord.js');

module.exports = {
    name: 'about',
    description: "shows bot info (about developer, etc)",
    execute (msg){

        const embedMsg = new Discord.MessageEmbed()
        .setColor('#2f3136')
        .setTitle('Github Repository')
        .setURL('https://github.com/chendumpling/FretBot')
        .setDescription('F.R.E.T. "Fragile Remains of the Eternal ThankBot" is a Javascript Discord bot creates threads for questions, lets users answer those questions, and stores user-awarded points in a MongoDB database. The goal is to encourage an active and organized community help forum similar to StackOverflow but on Discord. Users can ask and answer questions within the FretBot-created threads. With each question answered, other users can choose to thank the user(s) who answered the question by giving them points, leveling them up through roles. Points are also awarded to the user who is thanking to encourage an active discussion.')
        .addField('How points are calculated', 'The expression used is 100/(users^0.5)', false)
        .addField('Developer', 'Robert Chen', false);

        msg.channel.send({embeds: [embedMsg]});
    }
}
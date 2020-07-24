const Discord = require('discord.js');
const bot = new Discord.Client();
const secrets = require(`./secrets.json`);
const prefix = '-';
var serverID = '';
const fs = require('fs');
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.once('ready', () => {
    console.log('ThanksBot is online!');
});

bot.on('message', async msg => {
    serverID = msg.guild.id;
    //When message doesnt start with '-' or author is bot, do nothing
    if(!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    //Splices via space (ie "-thanks @robert")
    const withoutPrefix = msg.content.slice(prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);

    //The actual commands start here
    if (command === 'thanks' || command === 'thank') {
        bot.commands.get('thanks').execute(msg, args);
    }
    else if (command === 'rankup') {
        //Checks if user has enough points to rankup
        //Could also put this as a conditional to 
        //auto level in the thanks command module.
    }
    else if (command === 'points') {
        //Can ping yourself or someone else
        //
    }

});

//keep this at the last line of the file
//This is the client token
bot.login(secrets.Token);


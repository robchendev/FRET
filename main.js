const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NzM0MjAzNTQ3Nzk2ODk3Nzkz.XxkpMw.F6OR-UblGt7y9EDjLCmNCa4gOIE';


//Bot prefit
const prefix = '-';

const fs = require('fs');

bot.commands = new Discord.Collection();



//make sure files are .js in commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.once('ready', () => {
    console.log('ThanksBot is online!');
});

bot.on('message', message => {

    //When message doesnt start with '-' or author is bot, do nothing
    if(!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    //Splices via space (ie "-thanks @robert")
    const withoutPrefix = message.content.slice(prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);

    //The actual commands start here
    if (command === 'thanks' || command === 'thank') {
        bot.commands.get('thankcmd').execute(message, args);
    }
    
});

//keep this at the last line of the file
//This is the client token
bot.login(token);


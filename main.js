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
const usedCommandRecently = new Set(); //Tracks cooldowns

bot.once('ready', () => {
    console.log('ThanksBot is online!');
});

bot.on('message', async msg => {
    serverID = msg.guild.id;
    
    //When message doesnt start with '-' or author is 'bot, do nothing
    if(!msg.content.startsWith(prefix) || msg.author.bot) {
        return;
    }

    //Splices via space (ie "-thanks @robert")
    const withoutPrefix = msg.content.slice(prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);

    //Reads commands and does stuff
    switch(command) {

        case 'thank':
        case 'thanks':
            if(usedCommandRecently.has(msg.author.id)){
                msg.channel.send(`**${msg.author.username}**` + ", you can only thank once every 2 minutes.")
                .then(sentMsg => {
                    sentMsg.delete({ timeout: 10000 });
                }).catch(console.error);
            }
            else {
                if(bot.commands.get('thanks').execute(prefix, msg, args)){
                    setCooldown(2, msg);
                } 
            }
            break;
        case 'rankup':
            bot.commands.get('rankup').execute(msg);
            break;
        case 'points':
            bot.commands.get('points').execute(prefix, msg, args);
            break;
        case 'help':
            bot.commands.get('help').execute(prefix, msg);
            break;
        case 'about':
            bot.commands.get('about').execute(msg);
            break;
    }
});

/**
 * sets the cooldown of a command for a certain user
 * @param {number} cd - number of minutes to cooldown for
 * @param {Object} msg - original message sent to the channel
 */
function setCooldown(cd, msg) {
    
    usedCommandRecently.add(msg.author.id);
    setTimeout(() => {
        usedCommandRecently.delete(msg.author.id);
    }, (Math.floor((60000)*cd))); //one minute
}

//keep this at the last line of the file
bot.login(secrets.Token);


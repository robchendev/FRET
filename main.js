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
const usedCommandRecently = new Set();

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

    //Reads commands
    var x = command
    switch(x) {

        case x = 'thank':
        case x = 'thanks':
            if(usedCommandRecently.has(msg.author.id)){
                msg.channel.send(`**${msg.author.username}**` + ", you can only thank once every 2 minutes.")
                .then(sentMsg => {
                    sentMsg.delete({ timeout: 5000 });
                }).catch(console.error);
            }
            else {
                if(bot.commands.get('thanks').execute(msg, args)){
                    setCooldown(2, msg);
                } 
            }
            break;
        case x = 'rankup':
            //Checks if user has enough points to rankup
            //Could also put this as a conditional to 
            //auto level in the thanks command module.
            //Decide later
            break;
        case x = 'points':
            //Can ping yourself or someone else
            //Will display an embed message of how many points a user has,
            //And how much they need to rank up
            break;
        case x = 'report':
            //Receives user input arguments as a message.
            //Sends an embed message to the current channel saying a user has been reported
            //Sends an embed message to the a mod-only channel about an abuse of points saying "needs attention"
            //Displays reporting user's ID
            //Displays reported user's ID <@!useridhere>, date and time, and report contents
            //Has a reaction emoji attached to it. 
            //If reaction is clicked, reactions are all removed and prompt becomes "resolved"
            break;
        case x = 'help':
            //Sends an embed message of all commands and what they do
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


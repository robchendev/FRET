const Discord = require('discord.js');
const bot = new Discord.Client();
const pointsAdd = require("./models/addPoints.js");
const mongoose = require('mongoose');
const secrets = require(`./secrets.json`);

mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const prefix = '-';
var serverID = '';
const fs = require('fs');


bot.commands = new Discord.Collection();

//make sure files are .js in commands folder
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//for(const file of commandFiles){
//    const command = require(`./commands/${file}`);
//    bot.commands.set(command.name, command);
//}

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
       // try {
            await execute(msg, args);
        //} catch (err) {
        //    console.log("caught error");
        //    return;
        //}
    }
    
});

//Returns true if a name is mentioned more than once in the command
function getDuplicateArrayElements(arr){
    var sorted_arr = arr.slice().sort();
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            return true;
        }
    }
    return false;
}

function getUserFromMention(mention) {
    if (!mention) return;
    
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    }
    return false;
}

//Returns false if there is at least one command that isn't a mention
function isAllMentions(arr){
    
    for (var i = 0; i < arr.length; i++) {
        
        if (!getUserFromMention(arr[i])) {
            return false;
        }
    }
    return true;
}

function idToName(arr){
    const result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i].username;
    }
    return result;
}

async function thank (msg, usersID, usersName, score) {
    
    const addPoints = new pointsAdd({
        username: usersName,
        userID: usersID,
        points: score
    });

    addPoints.save()
    .then(result => console.log(result))
    .catch(err => console.log(err));

    msg.channel.send("Database updated");
}

async function thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score) {

    //Add score to different users
    for (var i = 0; i < numUsers; i++){
        
        //TODO...
        await thank(msg, allUsersID[i], allUsersName[i], score);
    }

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${`${msg.author}`} has thanked ${`${numUsers}`} users!`)
    .addField(`${score}` + " score added to:", `${args.join("\n")}`, false);
    msg.channel.send(embedMsg);
}

async function thankOnlyOne(msg, usersID, usersName, score) {

    //Add score to user

    //TODO...

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${msg.author}` + ' has thanked 1 user!')
    .addField(`${score}` + " score added to each:", `${args[0]}`, false);
    msg.channel.send(embedMsg);
    
}

function incorrectUsage(msg) {

    //Send embed message
    const embedMsg1 = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .addField('Thank one person', '\`-thanks <user>\`', false)
    .addField('Thank more than one person', '\`-thanks <user1> <user2> <user3>\`', false)
    .setFooter('Do not include < and >','');
    msg.channel.send(embedMsg1);
}

async function execute(msg, args){
    //When argument doesnt exist, or not all command arguments are mentions
    if (!args.length || !isAllMentions(args)) {

        incorrectUsage(msg);
    }
    else {

        //message.delete(); //Uncomment this if you want the user's comment to be deleted

        const numUsers = args.length;
        const score = Math.floor(500/(Math.pow(numUsers, 0.7)));
            
        //An array of user IDs (ie 189549341642326018)
        const allUsersID = msg.mentions.users.array();    

        //An array of user names (ie chendumpling)
        const allUsersName = idToName(allUsersID);

        //More than one user being thanked
        if (numUsers > 1){

            //Make sure there are no duplicates 
            if (getDuplicateArrayElements(args)) {
                msg.channel.send('Please do not thank the same person twice');
            }
            else {
                await thankMoreThanOne(msg, numUsers, allUsersID, allUsersName, score);
            }
        }

        //Only one user being thanked
        else {
           await thankOnlyOne(msg, allUsersID[0], allUsersName[0], score);
        }
    }
}

//keep this at the last line of the file
//This is the client token
bot.login(secrets.Token);


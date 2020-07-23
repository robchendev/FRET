const Discord = require('discord.js');

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

function thankMoreThanOne(numUsers, message, args, score) {

    //Add score to different users
    for (var i = 0; i < numUsers; i++){
        
        //TODO...
    }

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${`${message.author}`} has thanked ${`${numUsers}`} users!`)
    .addField(`${score}` + " score added to:", `${args.join("\n")}`, false);
    message.channel.send(embedMsg);
}

function thankOnlyOne(message, args, score) {

    //Add score to user

    //TODO...

    //Send embed message
    const embedMsg = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .setDescription(`${message.author}` + ' has thanked 1 user!')
    .addField(`${score}` + " score added to each:", `${args[0]}`, false);
    message.channel.send(embedMsg);

}

function incorrectUsage(message) {

    //Send embed message
    const embedMsg1 = new Discord.MessageEmbed()
    .setColor('#ed5555')
    .addField('Thank one person', '\`-thanks <user>\`', false)
    .addField('Thank more than one person', '\`-thanks <user1> <user2> <user3>\`', false)
    .setFooter('Do not include < and >','');
    message.channel.send(embedMsg1);
}

module.exports = {
    
    name: 'thankcmd',
    description: "calls function from Tatsumaki bot to add points depending on thanks",
    
    execute(message, args){

        //When argument doesnt exist, or not all command arguments are mentions
        if (!args.length || !isAllMentions(args)) {

            incorrectUsage(message);
        }
        else {

            //message.delete(); //Uncomment this if you want the user's comment to be deleted

            const numUsers = args.length;
            const score = Math.floor(500/(Math.pow(numUsers, 0.7)));
                
            //An array of user IDs (ie 189549341642326018)
            const allUsersID = message.mentions.users.array();    

            //An array of user names (ie chendumpling)
            const allUsersName = idToName(allUsersID);

            //More than one user being thanked
            if (numUsers > 1){

                //Make sure there are no duplicates 
                if (getDuplicateArrayElements(args)) {
                    message.channel.send('Please do not thank the same person twice');
                }
                else {
                    thankMoreThanOne(numUsers, message, args, score);
                }
            }

            //Only one user being thanked
            else {
                thankOnlyOne(message, args, score);
            }
        }
    }
}
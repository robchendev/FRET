const Discord = require('discord.js');

/**
 * Gives the user the blacklist role if they don't have it already
 * @param {Object} msg - the original command message 
 * @param {string} thisUser - id of the user to adjust the roles of
 * @param {string} blacklistRole - the blacklist role to be given
 */
function doBlackList(msg, thisUser, blacklistRole) {
    
    //If user does not have the role
    if (!thisUser.roles.cache.some(r => r.name === "help-blacklist")){
        thisUser.roles.add(blacklistRole.id);
        const embedMsg = new Discord.MessageEmbed()
        .setColor('#fc00f8')
        .setDescription(`${thisUser} is now blacklisted from this channel.`);
        msg.channel.send({embeds: [embedMsg]});
    }
    //If user already has the role
    else {
        msg.channel.send("User is already blacklisted.");
    }
}

/**
 * Removes the blacklist role from the user if they have it
 * @param {Object} msg - the original command message 
 * @param {string} thisUser - id of the user to adjust the roles of
 * @param {string} blacklistRole - the blacklist role to be removed
 */
function undoBlackList(msg, thisUser, blacklistRole) {
    
    //If user does not have the role
    if (!thisUser.roles.cache.some(r => r.name === "help-blacklist")){
        msg.channel.send("User is not blacklisted.");
    }
    //If user already has the role
    else {
        thisUser.roles.remove(blacklistRole.id);
        const embedMsg = new Discord.MessageEmbed()
        .setColor('#fc00f8')
        .setDescription(`${thisUser} is no longer blacklisted from this channel.`);
        msg.channel.send({embeds: [embedMsg]});
    }
}

module.exports = {
    name: 'blacklist',
    description: "this mod command adds a role to the user to blacklist them from a channel",
    execute (msg, args){
        let mention = msg.mentions.members.first();
        if (mention){
            if (args.length === 1){
                let roleToAdd = msg.guild.roles.cache.find(r => r.name === "help-blacklist")
                doBlackList(msg, mention, roleToAdd);

            }
            else if (args.length === 2){
                let roleToRemove = msg.guild.roles.cache.find(r => r.name === "help-blacklist")
                undoBlackList(msg, mention, roleToRemove);

            }
        }
    }
}
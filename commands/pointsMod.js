const Discord = require('discord.js');
const mongoose = require('mongoose');
const secrets = require(`../secrets.json`);
const pointsChange = require("../models/addPoints.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

/**
 * Decreases users points in database and sends an embed message
 * @param {Object} msg - the original message sent
 * @param {string} usersID - a single user's ID
 * @param {number} deincrement - the amount of points to subtract by
 */
function decPoints (msg, usersID, deincrement) {
    
    pointsChange.findOne({userid: usersID}, (err, pointdata) => {
        if(err) console.log(err);
        if(pointdata){
            beforeChange = pointdata.points;

            pointdata.points = pointdata.points - deincrement;
            pointdata.save().catch(err => console.log(err));

            const embedMsg = new Discord.MessageEmbed()
            .setColor('#fc00f8')
            .setDescription(`${usersID}'s points have been changed from ${beforeChange} to ${pointdata.points}`);
            msg.channel.send({embeds: [embedMsg]});
        }
        else {
            let resultPoints = 0 - deincrement;
            const addPoints = new pointsChange({
                userid: usersID,
                points: resultPoints 
            })
            addPoints.save().catch(err => console.log(err));
            const embedMsg = new Discord.MessageEmbed()
            .setColor('#fc00f8')
            .setDescription(`${usersID}'s points have been changed from 0 to ${resultPoints}`);
            msg.channel.send({embeds: [embedMsg]});
        }
    })
}

/**
 * Sets users points in database and sends an embed message
 * @param {Object} msg - the original message sent
 * @param {string} usersID - a single user's ID
 * @param {number} set - the points amount to be set to
 */
function setPoints (msg, usersID, set) {
    
    pointsChange.findOne({userid: usersID}, (err, pointdata) => {
        if(err) console.log(err);
        if(pointdata){
            beforeChange = pointdata.points;

            pointdata.points = set;
            pointdata.save().catch(err => console.log(err));

            const embedMsg = new Discord.MessageEmbed()
            .setColor('#fc00f8')
            .setDescription(`${usersID}'s points have been changed from ${beforeChange} to ${pointdata.points}`);
            msg.channel.send({embeds: [embedMsg]});
        } else {
            const addPoints = new pointsChange({
                userid: usersID,
                points: set
            })
            addPoints.save().catch(err => console.log(err));
            const embedMsg = new Discord.MessageEmbed()
            .setColor('#fc00f8')
            .setDescription(`${usersID}'s points have been changed from 0 to ${set}`);
            msg.channel.send({embeds: [embedMsg]});
        }
    })
    
}

/**
 * Sends embed message on how to use the command properly
 * @param {*} prefix - the prefix of the command
 * @param {*} msg - the original command message
 */
function incorrectUsage(prefix, msg) {

    const embedMsg = new Discord.MessageEmbed()
    .setColor('#fc00f8')
    .addField('Increase points', `\`${prefix}points <user> inc <points>\``, false)
    .addField('Decrease points', `\`${prefix}points <user> dec <points>\``, false)
    .addField('Set points', `\`${prefix}points <user> set <points>\``, false)
    .addField('Default penalty (-1000)', `\`${prefix}points <user> pen\``, false)
    .addField('Careful', 'Do not include < and >. Use @', false);
    msg.channel.send({embeds: [embedMsg]});
}

module.exports = {
    name: 'pointsMod',
    description: "this mod command changes the points of a user",
    execute (prefix, msg, args){
        if (args.length > 0){
            // Removes nickname ! in ID
            let mention = String(msg.mentions.users.first()).replace('!','');
            let doCommand = args[1];
            switch(doCommand) {
                case 'inc':
                    let increment = args[2];
                    if (!isNaN(parseInt(increment))){
                        decPoints(msg, mention, increment*(-1));
                    }
                    else {
                        msg.channel.send(`Correct usage: \`${prefix}points <user> inc <points>\``);
                    }
                    break;
                case 'dec':
                    let deincrement = args[2];
                    if (!isNaN(parseInt(deincrement))){
                        decPoints(msg, mention, deincrement);
                    }
                    else {
                        msg.channel.send(`Correct usage: \`${prefix}points <user> dec <points>\``);
                    }
                    break;
                case 'set':
                    let set = args[2];
                    if (!isNaN(parseInt(set))){
                        setPoints(msg, mention, set);
                    }
                    else {
                        msg.channel.send(`Correct usage: \`${prefix}points <user> set <points>\``);
                    }
                    break;
                case 'pen':
                    decPoints(msg, mention, 1000);
                    break;
                default:
                    incorrectUsage(prefix, msg);
                    break;
            }
        }
        else {
            incorrectUsage(prefix, msg);
        }
    }
}
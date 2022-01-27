const Discord = require("discord.js");
const mongoose = require("mongoose");
const { arrayBuffer } = require("stream/consumers");
const configHandler = require(`../../handlers/configurationHandler.js`);
configHandler.initialize();
const pointsList = require("../../models/addPoints.js");
mongoose.connect(configHandler.secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
/** 
 * Generates a leaderboard with the top 10 users with the most
 * help forum points, and also lists the command user's 
 * placement and score at the bottom.
 * 
 * Note: This is a lot of template literals... it's easier
 * to understand by looking at what it does, just use 
 * '-leaderboard' in a general chat.
 * 
 * @param {Client} bot - the client that allows use of discord js
 * @param {Message} msg - the original message sent by the command 
 */
function generateLeaderboard(bot, msg, maxRows){

    pointsList.find({}, (err, documents) => {
        if (err) console.log(err);
        sortedArray = [];
        let name = "";
        let userPlacement = undefined;
        let userPoints = undefined;
        let nameSpacing = 0;
        let placementSpacing = 0;
        let thisName = undefined;
        let columnPaddingRight = 2;

        documents.forEach((pointsdata) => {
            if (pointsdata.points !== 0){

                // gets rid of <@ and > around the ID
                userIdRaw = pointsdata.userid.replace(/<|@|>|!/g, "")
                name = bot.users.cache.get(userIdRaw);
                if (name != undefined) {
                    thisName = name.username.replace(/\*|_|~|\`/g, "")

                    // make the 3-tuple to add to the sortedArray
                    sortedArray.push([
                        pointsdata.points, 
                        thisName, 
                        userIdRaw,
                    ]);
                }
            }
        });

        // put array elements in order, user with most points shown on top.
        sortedArray.sort(function(a, b){
            return b[0]-a[0];
        })
        
        // make sure maxRows isnt bigger than array's size
        if (maxRows > sortedArray.length) {
            maxRows = sortedArray.length;
        }

        // get column minimum widths
        for (let i = 0; i < maxRows; i++){
            if (sortedArray[i][1].length > nameSpacing)
                nameSpacing = sortedArray[i][1].length;
            if (sortedArray[i][0].toString().length > placementSpacing)
                placementSpacing = i.toString().length;
        }
        placementSpacing += columnPaddingRight;
        nameSpacing += columnPaddingRight;
        pointLength = sortedArray[0][0].toString().length - 1;

        // begin making the description string to be added
        let description = `\`\`\`py\n`;

        // loop through and add rows based on array up to 10
        for (let i = 0; i < sortedArray.length; i++) {

            // ensures the table does not print more than 10 rows
            if (i < maxRows){
                description += `${i+1} ${" ".repeat(placementSpacing - (i+1).toString().length)}`;
                description += `${sortedArray[i][1]} ${" ".repeat(nameSpacing - sortedArray[i][1].length)}`;
                description += `${sortedArray[i][0]}`;
                description += `\n`;
            }
            // store the command's user's stats
            if (sortedArray[i][2] === msg.author.id){
                userPlacement = i+1;
                userPoints = sortedArray[i][0];
            }
        }

        // prints dividing line to show the command's user's stats
        let embedWidth = nameSpacing + columnPaddingRight + placementSpacing + columnPaddingRight + pointLength;
        description += `${"-".repeat(embedWidth)}\nYour server stats:\n`;

        // this will only run when command's user has a pointdata schema
        if (userPlacement != undefined){
            // show the command's users stats
            
            description += `${userPlacement} ${" ".repeat(placementSpacing - userPlacement.toString().length)}`;
            description += `${msg.author.username} ${" ".repeat(nameSpacing - msg.author.username.length)}`;
            description += `${userPoints}`;
        } else {
            description += `You have 0 points`;
        }
        description += `\n\`\`\``;

        const embedMsg = new Discord.MessageEmbed()
            .setColor(configHandler.data.transparentColor)
            .setTitle(`Help Forum Leaderboard`)
            .setDescription(description);
        msg.channel.send({ embeds: [embedMsg] });
    });
}

module.exports = {
    name: "leaderboard",
    description: "this command generates a leaderboard of the current users with points",
    execute(bot, msg, args) {
        let maxRows = 10;
        if (!isNaN(args[0])){
            maxRows = args[0];
        }
        generateLeaderboard(bot, msg, maxRows);
    },
};
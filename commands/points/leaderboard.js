const Discord = require("discord.js");
const mongoose = require("mongoose");
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
 * @param {*} msg 
 */
function generateLeaderboard(bot, msg){
    pointsList.find({}, (err, documents) => {
        if (err) console.log(err);

        sortedArray = [];
        let name = "";

        // refresh bot's cache
        msg.guild.members.fetch()
        .then(() => {
            documents.forEach((pointsdata) => {
                if (pointsdata.points !== 0){
                    // gets rid of <@ and > around the ID
                    name = bot.users.cache.get(pointsdata.userid.replace(/<|@|>|!/g, ""));
                    if (name != undefined) {
                        sortedArray.push([pointsdata.points, name.username]);
                    }
                }
    
                // Find user's points placement based on user (second element)
                // while the bot loops through the array to add them to the embed.
            });

            // put array elements in order of increasing points
            sortedArray.sort(function(a, b){
                return b[0]-a[0];
            })
            console.log(sortedArray)
            // for (let i = 0; i < sortedArray.length; i++) {

                
            //     if (sortedArray)
            // }
            
        });
        
       
    });
}

module.exports = {
    name: "leaderboard",
    description: "this command generates a leaderboard of the current users with points",

    execute(bot, msg) {
        generateLeaderboard(bot, msg);
    },
};
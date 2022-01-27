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

        unsortedArray = [];
        let name = "";
        // [[points,user],[points,user]]
        documents.forEach((pointsdata) => {
            if (pointsdata.points !== 0){

                // we want to get this into [points,user]
                // and store it inside unsortedArray

                // gets rid of <@ and > around the ID
                name = bot.users.cache.get(pointsdata.userid.replace(/<|@|>|!/g, ""));

                if (name != undefined) {
                    
                    unsortedArray.push([pointsdata.points,name.username]);
                }
                

            }
            console.log(unsortedArray)



            // Find user's points placement based on user (second element)
            // while the bot loops through the array to add them to the embed.
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
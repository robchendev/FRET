const ids = require(`../ids.json`);
var tools = require(`../tools/functions.js`);
const secrets = require(`../secrets.json`);
const mongoose = require('mongoose');
const updateWeekly = require("../models/weeklyUpdate.js");
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// lastWeekSubmission AND thisWeekSubmission needs to be defined
// for an increase in "streak".
// If thisWeekSubmission is not active, the role is taken away.

// this cron also moves thisweeksubmission into lastweeksubmission
// and lastweeksubmission to lastlastweeksubmission
// lastlastweeksubmission data is lost intentionally.

/**
 * Creates a thread to log the results of this week's submissions
 * @param {Client} bot - the client that lets F.R.E.T. use discordJS methods
 * Need to refactor. and update comment
 */
async function createThread(bot, myGuild, roleNames, roleStreak){

    // create dates
    let dateToday = new Date();
    let dateWeekAgo = new Date();
    dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);
    
    // Convert to more readable date strings
    let today = dateToday.toISOString().split('T')[0];
    //let weekAgo = dateWeekAgo.toISOString().split('T')[0];

    // Prepare thread 
    let threadTitle = "Finalization " + today;

    

    //need to make message first to start the thread
    bot.channels.cache.get(ids.weeklyChannel).send('content')
    .then(async sentMsg => {
        
        // Make sure the message was actually sent by the bot in weeklyChannel
        if(sentMsg.channel.id === ids.weeklyChannel && sentMsg.author.bot) {
            const thread = await sentMsg.startThread({
                name: threadTitle,
                autoArchiveDuration: 60
            });

            updateWeekly.find({}, (err, documents) => {
                if(err) console.log(err);
                documents.forEach((submitdata) => {


                    // If submitted this week
                    if(submitdata.thisWeek != undefined) {

                        // check rankup, if rankup, return addedRank string
                        rankupCheck(bot, myGuild, thread, submitdata, roleNames, roleStreak);
                        // did not rank up
                        // else {
                        //     finalizationMsg += ` maintained their rank.`
                        // }
                    }
                    
                    // If did not submit this week
                    else{

                        resetStreak(submitdata);
                        repairRoles(submitdata, myGuild, roleStreak, roleNames);
                        let name = bot.users.cache.get(submitdata.userid).username;
                        thread.send(`**${name}** lost their rank. Streak: **${streak}**`);
                    }
                    startNewWeek(submitdata);
                    submitdata.save().catch(err => console.log(err));
                    
                });
            });

            };
    }).catch();
}

/**
 * Pulls the user's streak count from the database
 * @param {Schema} submitdata - holds submission data
 * @param {Callback} cb
 */
function howManyStreaks(submitdata, cb){
    updateWeekly.findOne({userid: submitdata.userid}, (err, doc) => {
        if(err) 
            return cb(err, null);
        if(doc) {
            //console.log(submitdata.streak);
            return cb(null, doc.streak);
        }
        else {
            return cb(null, null);
        }
    })
}

function doRankUp(bot, myGuild, thread, submitdata, roleNames, roleStreak, index){

    // THIS NEEDS TO BE GUILD MEMBER OBJECT
    let user = myGuild.members.cache.get(submitdata.userid)
    // need intent GUILD_PRESENCES for this to work
    let name = bot.users.cache.get(submitdata.userid).username;
    
    // If user does not have new role
    if (!user.roles.cache.has(roleNames[index].id)){

        // removes roles if user has them (since we're upgrading roles)
        repairRoles(submitdata, myGuild, roleStreak, roleNames);
        user.roles.add(roleNames[index].id);
        thread.send(`**${name}** ranked up to **${roleNames[index].name}**! Streak: **${submitdata.streak}**`);
    }
    // when user is maintaining role
    else {
        thread.send(`**${name}** maintained their rank. Streak: **${submitdata.streak}**`);
    }
}

// See if needs rank up/down/maintain
function rankupCheck(bot, myGuild, thread, submitdata, roleNames, roleStreak){

    updateStreak(submitdata);

    howManyStreaks(submitdata, (err, streak) => {
        
        
        console.log(streak)
        if(err) console.log(err);
        else if(streak){
            
            // Adding an increment because this actually needs to be
            // an await, but this is a hack
            
            switch(true){
                case streak + 1 >= roleStreak[2]: // 9 streak
                    doRankUp(bot, myGuild, thread, submitdata, roleNames, roleStreak, 2);
                    break;
                case streak + 1 >= roleStreak[1]: // 4 streak
                    doRankUp(bot, myGuild, thread, submitdata, roleNames, roleStreak, 1);
                    break;
                case streak + 1 >= roleStreak[0]: // 1 streak  
                    doRankUp(bot, myGuild, thread, submitdata, roleNames, roleStreak, 0);
                    break;
                case streak == 0: // 0 streak / streak reset
                    console.log("default")

                    // This isnt working
                    // this can never be reached because the only way to reach inside the scope
                    // of rankupCheck is to have submitted a weekly thisWeek.
                    // updateStreak being invoked before this switch case shows up means that
                    // streak will never be 0.
                    repairRoles(submitdata, myGuild, roleStreak, roleNames);
                    
                    break;
            }
        }
        else {
            // user submitted this week to make it here
            doRankUp(bot, myGuild, thread, submitdata, roleNames, roleStreak, 0);
            console.log("else")
        }
    });
}
/**
 * Removes all roles in roleNames from the user
 * @param {Schema} submitdata - holds submission data
 * @param {Array} roleNames - array of roles to be given
 * @param {Array} rolePoints - array of point thresholds for each corresponding role
 */
function repairRoles(submitdata, myGuild, roleStreak, roleNames){
    
    // retrieve member object for user
    let user = myGuild.members.cache.get(submitdata.userid)

    for (var i = 0; i < roleStreak.length; i++){
        if (user.roles.cache.has(roleNames[i].id)){
            user.roles.remove(roleNames[i].id)
        }
    }
}
function updateStreak(submitdata){

    submitdata.streak += 1;
    if(submitdata.highestStreak < submitdata.streak) {
        submitdata.highestStreak = submitdata.streak;
    }
}
function resetStreak(submitdata){
    submitdata.streak = 0;
}
function startNewWeek(submitdata){
    submitdata.lastLastWeek = submitdata.lastWeek;
    submitdata.lastWeek = submitdata.thisWeek;
    submitdata.thisWeek = undefined;
}

// Note: This doesnt error check for permissions
// So you must make sure ids.json "weeklyChannel" is correct
// and the bot must have permission to view, send messages,
// and create thread in it.
module.exports = {
    name: 'weeklyCron',
    description: "this command is passively invoked on Monday 12:00 AM EST every week to update roles for the weekly submissions.",
    execute (bot){

        // retrieves guild object
        let myGuild = bot.guilds.cache.get(ids.serverGuildID);
        
        // Weekly streak roles
        var roleNames = [
            /*0*/myGuild.roles.cache.find(r => r.name === ids.wRank1),
            /*1*/myGuild.roles.cache.find(r => r.name === ids.wRank2),
            /*2*/myGuild.roles.cache.find(r => r.name === ids.wRank3)
        ];
        
        // the points that are required to get each streak role
        var roleStreak = [
            /*0*/ids.wRank1Streak,
            /*1*/ids.wRank2Streak,
            /*2*/ids.wRank3Streak
        ];
        
        
        createThread(bot, myGuild, roleNames, roleStreak);
    }
}

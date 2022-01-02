const ids = require(`../ids.json`);
var tools = require(`../tools/functions.js`);

// lastWeekSubmission AND thisWeekSubmission needs to be defined
// for an increase in "consecutiveSubmissions".
// If thisWeekSubmission is not active, the role is taken away.

// this cron also moves thisweeksubmission into lastweeksubmission
// and lastweeksubmission to lastlastweeksubmission
// lastlastweeksubmission data is lost intentionally.

module.exports = {
    name: 'weeklyCron',
    description: "this command is passively invoked on Monday 12:00 AM EST every week to update roles for the weekly submissions.",
    execute (){
        // Creates a thread that logs all promotions/demotions
        // Only create thread in weeklyChannel
    }
}
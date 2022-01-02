// lastWeekSubmission AND thisWeekSubmission needs to be defined
// for an increase in "consecutiveSubmissions".
// If thisWeekSubmission is not active, the role is taken away.





module.exports = {
    name: 'weeklyCron',
    description: "this command is passively invoked on Monday 12:00 AM EST every week to update roles for the weekly submissions.",
    execute (){
        // Creates a thread that logs all promotions/demotions
    }
}
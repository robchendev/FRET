const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    streak: Number,
    highestStreak: Number,
    thisWeek: Date,
    lastWeek: Date,
    lastLastWeek: Date
    // the schema only stores up to 2 weeks ago
    // after that, the next update deletes the info
    // we have 3 to give more headroom if we want to
    // restore someone's data from last week
})
module.exports = mongoose.model("Weekly submission data", Schema);
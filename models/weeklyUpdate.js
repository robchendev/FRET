const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    streak: Number,
    highestStreak: Number,
    thisWeek: Date,
    lastWeek: Date
})
module.exports = mongoose.model("Weekly submission data", Schema);
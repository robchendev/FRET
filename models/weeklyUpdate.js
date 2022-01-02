const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    consecutiveSubmissions: Number,
    submissionThisWeek: Date,
    submissionLastWeek: Date,
    submissionLastLastWeek: Date
    // submissions from 2 weeks ago are needed for moderation purposes.
    // dont store by date objects, it'll be too inefficient
})
module.exports = mongoose.model("Most recent submission", Schema);
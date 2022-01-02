const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    consecutiveSubmissions: Number,
    submissionThisWeek: Date,
    submissionLastWeek: Date,
    submissionLastLastWeek: Date
})
module.exports = mongoose.model("Weekly submission data", Schema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    recentSubmission: Date
})
module.exports = mongoose.model("Most recent submission", Schema);
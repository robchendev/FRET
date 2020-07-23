const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    username: String,
    points: Number
})

module.exports = mongoose.model("Score pointdata", Schema);
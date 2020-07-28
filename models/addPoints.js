const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userid: String,
    points: Number
})

module.exports = mongoose.model("Score pointdata", Schema);
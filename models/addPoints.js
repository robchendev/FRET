const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    points: Number
});

module.exports = mongoose.model("Score data", Schema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema({
  userid: String,
  points: Number,
  wasThanked: Number,
  gaveThanks: Number,
});

module.exports = mongoose.model("Score pointdata", Schema);

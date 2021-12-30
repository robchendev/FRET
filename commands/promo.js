const Discord = require('discord.js');
const mongoose = require('mongoose');
const pointsAdd = require("../models/addPoints.js");
const secrets = require(`../secrets.json`);
mongoose.connect(secrets.Mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});


module.exports = {
    name: 'promo',
    description: "this command posts user's promotion material into a regular #promo channel",
    execute (msg){

    }
}
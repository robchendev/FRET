const commandHandler = require(`../handlers/commandHandler.js`);
module.exports = {
    ready: function() {
        console.log("F.R.E.T. started.");

        // console.log("Registering slash commands.");
        // commandHandler.registerSlashCommands();

        // console.log("Restricting slash commands.");

    },
    processInteraction: async function(client, interaction) { await commandHandler.handleInteraction(client, interaction); },
    processMessage: async function(client, message) {

    },
    joinGuild: function (guild) {
        console.log(`Joined guild '${guild.name}'.`);
        commandHandler.registerSlashCommands();
    },
    leaveGuild: function (guild) {
        console.log(`Removed from guild '${guild.name}'.`);
        commandHandler.unregisterSlashCommands();
    }
};
const { Collection } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const secrets = require(`../secrets.json`);
const rest = new REST({ version: '9' }).setToken(secrets.Token);
const directoryHandler = require(`../handlers/directoryHandler.js`);

// Initialize the configuration handler.
const configHandler = require(`./configurationHandler`);
configHandler.initialize();

module.exports = {
    /** The standard commands being handled. */
    commands: [],
    /** The slash commands being handled. */
    slashCommands: [],
    /** The slash commands being handled, explicitly for moderators only. */
    moderatorSlashCommands: [],
    /** Discover all commands for the bot in a recursive manner. */
    discover: function () {
        let commandFiles = directoryHandler.loadFilesRecursive(`commands`, `js`);
        for (const file of commandFiles) {
            const command = require(`../${file}`);

            // Not all commands have this ability yet. Provide a warning for those who fail.
            try {
                command.registerWithHandlers();
            } catch (error) {
                console.warn(`Unable to regiser ${command.name} with handlers.`);
            }

            // Determine what type of command this is.
            // if (file.indexOf(`.mod.slash.js`) > 0)
            //     this.moderatorSlashCommands.push(command);
            // else
            if (file.indexOf(`.slash.js`) > 0)
                this.slashCommands.push(command);
            else
                this.commands.push(command);
        }
    },
    /** Register all standard commands with the Discord client. */
    registerCommands: function (client) {
        client.commands = new Collection();
        for (let command of this.commands)
            client.commands.set(command.name, command);
        for (let command of this.slashCommands)
            client.commands.set(command.name, command);
        for (let command of this.moderatorSlashCommands)
            client.commands.set(command.name, command);
    },
    /** Register all slash commands with the Discord client. */
    registerSlashCommands: async function () {
        try {
            let commandsToRegister = [];

            // Register basic slash commands.
            for (let command of this.slashCommands)
                commandsToRegister.push(command.data.toJSON());

            // Moderator commands must still be registered.
            for (let command of this.moderatorSlashCommands)
                commandsToRegister.push(command.data.toJSON());

            await rest.put(Routes.applicationGuildCommands(secrets.discordClientId, configHandler.flux.serverGuild), { body: commandsToRegister });
            console.log(`Successfully registered all slash commands.`);
        } catch (error) { console.error(`There was an issue registering slash commands: ${error}`); }
    },
    /** Unregister all slash commands with the Discord client. */
    unregisterSlashCommands: async function () {
        try {
            await rest.put(Routes.applicationGuildCommands(secrets.discordClientId, configHandler.flux.serverGuild), { body: [] });
        } catch (error) { console.error(`There was an issue unregistering slash commands: ${error}`) };
    },
    // restrictModeratorCommands: function (client) {
    //     client.commands.forEach(command => {
    //         for (let modCommand of this.moderatorSlashCommands) {
    //             if (command.name === modCommand.name) {
    //                 guild.commands.permissions.set({
    //                     command: command.id, permissions: [
    //                         {
    //                             id: configHandler.flux.everyoneRoleId,
    //                             type: 'ROLE',
    //                             permission: false
    //                         },
    //                         {
    //                             id: configHandler.flux.moderatorRoleId,
    //                             type: 'ROLE',
    //                             permission: true
    //                         }
    //                     ]
    //                 }).catch(console.log);
    //             }
    //         }
    //     });
    // },
    /** Handle an interaction with the Discord client. */
    handleInteraction: async function (client, interaction) {
        if (!interaction.isCommand())
            return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
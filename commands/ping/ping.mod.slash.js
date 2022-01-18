const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'mping',
	data: new SlashCommandBuilder()
		.setName('mping')
		.setDescription('Replies with Pong, but for moderators only!'),
	async execute(interaction) {
		await interaction.reply({ content: 'Pong, but for moderators only!', ephemeral: true });
	},
};
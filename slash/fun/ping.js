const discord = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Get the bot's ping!",
	run: async (client, interaction, args) => {
		await interaction.reply({
			content: 'test',
		});
	},
};

const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'image',
	description: 'Show your in-game legend banner.',

	run: async (client, interaction) => {
		interaction.followUp({
			content:
				'With the switch to Slash Commands, this command has been temporarily disabled. Please try again later.',
		});
	},
};

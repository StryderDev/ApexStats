const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'privacypolicy',
	description: 'Show the bots privacy policy.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		interaction.followUp({
			content: 'View our privacy policy: <https://apexstats.dev/privacypolicy>',
		});
	},
};

const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'privacy',
	description: 'Returns a link to our Privacy Policy.',
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let start = Date.now();
		let end = Date.now();

		await interaction.followUp({ content: 'https://apexstats.dev/privacypolicy' }).catch(e => interaction.reply(e));
	},
};

const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Invite the bot to your server.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		interaction.followUp({
			content: 'Invite the bot to your own server using this link: <https://apexstats.dev/invite>',
		});
	},
};

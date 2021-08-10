const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	name: 'message',
	description: 'Sends a template message. Used for auto-rotating messages.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const message = new MessageEmbed()
			.setTitle('Module Placeholder')
			.setDescription('This is a placeholder, and will be updated once the module is enabled.');

		interaction.followUp({
			embeds: [message],
		});
	},
};

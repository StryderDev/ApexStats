const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'help',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		message.reply({
			content: 'Commands have bene reverted back to >> commands. Use >> and then the command you want to use.',
		});
	},
};

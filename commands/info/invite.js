const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'invite',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		message.reply({
			content: 'Invite the bot to your own server using this link: <https://apexstats.dev/invite>',
		});
	},
};

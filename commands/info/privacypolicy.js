const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'privacypolicy',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		message.reply({
			content: 'View our privacy policy: <https://apexstats.dev/privacypolicy>',
		});
	},
};

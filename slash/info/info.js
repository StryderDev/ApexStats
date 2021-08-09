const { Client, CommandInteraction } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	name: 'info',
	description: 'Shows info about the bot.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		let days = Math.floor(process.uptime() / 86400);
		let hours = Math.floor(process.uptime() / 3600) % 24;
		let minutes = Math.floor(process.uptime() / 60) % 60;
		let seconds = Math.floor(process.uptime()) % 60;

		interaction.followUp({ content: `Version: ${version}\nUptime: ${days}d, ${hours}h, ${minutes}m, ${seconds}s` });
	},
};

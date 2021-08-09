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
		let guildCount = (await client.cluster.broadcastEval(`this.guilds.cache.size`)).reduce(
			(acc, guildCount) => Number(acc + guildCount),
			0,
		);

		let days = Math.floor(process.uptime() / 86400);
		let hours = Math.floor(process.uptime() / 3600) % 24;
		let minutes = Math.floor(process.uptime() / 60) % 60;
		let seconds = Math.floor(process.uptime()) % 60;

		interaction.followUp({
			content: `Guilds: ${guildCount.toLocaleString()}\nGuild Cluster ID: ${client.cluster.id + 1}/${
				client.cluster.count
			}\nVersion: ${version}\nUptime: ${days}d, ${hours}h, ${minutes}m, ${seconds}s`,
		});
	},
};

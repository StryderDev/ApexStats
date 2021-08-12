const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { version, dependencies } = require('../../package.json');
const { isPlural } = require('../../functions/misc.js');

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

		const info = new MessageEmbed()
			.setTitle('Apex Legends Stats Bot')
			.setThumbnail('https://cdn.apexstats.dev/Icon.png')
			.setDescription(
				'Show Apex Legends User Stats, Map Rotations, Server Status, and more. Type `/` to see available commands. If you need help, or have any questions, join the [Support Server](https://discord.gg/eH8VxssFW6).',
			)
			.addField(
				'Uptime',
				`${isPlural(days, 'day')}, ${isPlural(hours, 'hour')}, ${isPlural(minutes, 'minute')}, ${isPlural(
					seconds,
					'second',
				)}`,
			)
			.addField(
				'Bot Info',
				`Version: ${version}\nD.JS Version: ${
					dependencies['discord.js']
				}\nGuild Count: ${guildCount.toLocaleString()}`,
				true,
			)
			.addField(
				'Useful Links',
				`[Trello](https://apexstats.dev/trello)\n[Invite Bot](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)`,
				true,
			)
			.addField(
				'Stats',
				`[Apex Bot Stats](https://apexstats.dev/)\n[BR Ranked Leaderboards](https://br.apexstats.dev/)\n[Arenas Ranked Leaderboards](https://arenas.apexstats.dev/)`,
				true,
			);
		interaction.followUp({
			embeds: [info],
		});
	},
};

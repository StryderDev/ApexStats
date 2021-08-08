const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	name: 'info',
	description: 'Returns info about the bot.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const name = `${client.user.username}#${client.user.discriminator}`;

		let days = Math.floor(process.uptime() / 86400);
		let hours = Math.floor(process.uptime() / 3600) % 24;
		let minutes = Math.floor(process.uptime() / 60) % 60;
		let seconds = Math.floor(process.uptime()) % 60;

		function memUsage() {
			return `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
		}

		const info = new MessageEmbed()
			.setTitle(name)
			.setThumbnail('https://cdn.apexstats.dev/Icon.png')
			.setDescription(
				'This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Type `/` and a command for a list of commands.',
			)
			.addField(
				'Version',
				`${version}\n**Memory Usage**\n${memUsage()}\n**Uptime**\n${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
				true,
			)
			.addField(
				'Useful Links',
				`[Trello](https://apexstats.dev/trello)\n[Invite Bot](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)\n[Support Server](https://discord.gg/eH8VxssFW6)\n[Ranked Leaderboards](https://ranked.apexstats.dev/)`,
				true,
			)
			.addField('\u200b', '\u200b', true)
			.setFooter('Stryder Dev 2021', 'https://sdcore.dev/i/1m3gbh27.png');

		interaction.followUp({
			embeds: [info],
		});
	},
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('uptime').setDescription('Show bot uptime.'),
	async execute(client, interaction) {
		function isPlural(number, text) {
			if (number != 1) return `${number} ${text}s`;

			return `${number} ${text}`;
		}

		let days = Math.floor(process.uptime() / 86400);
		let hours = Math.floor(process.uptime() / 3600) % 24;
		let minutes = Math.floor(process.uptime() / 60) % 60;
		let seconds = Math.floor(process.uptime() / 1) % 60;

		await interaction.reply({
			content: `<:Uptime:896958688781283329> Uptime: ${isPlural(days, 'day')}, ${isPlural(
				hours,
				'hour',
			)}, ${isPlural(minutes, 'minute')}, ${isPlural(seconds, 'second')}`,
		});
	},
};

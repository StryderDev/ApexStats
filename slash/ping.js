const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Show current websocket and message latency.'),
	async execute(client, interaction) {
		await interaction.reply({ content: 'Detecting API and Message Latency...' });

		await interaction.editReply({
			content: `**API Latency:** \`${Math.round(client.ws.ping)}ms\`\n**Message Latency:** \`${
				Date.now() - interaction.createdTimestamp
			}ms\``,
		});
	},
};

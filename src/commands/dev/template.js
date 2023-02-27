const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('template').setDescription('[DEV ONLY.]'),

	async execute(interaction) {
		if (interaction.member.id != '360564818123554836') return;

		const templateEmbed = new EmbedBuilder().setTitle('Template Message').setDescription('This is a template message. It will be updated once the module is setup.');

		interaction.deleteReply();
		interaction.channel.send({ embeds: [templateEmbed] });
	},
};

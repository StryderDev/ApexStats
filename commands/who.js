const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('who').setDescription('Pick a random legend to play.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(
			`<a:ApexBot_Loading:940037271980220416> Choosing a random legend...`,
		);

		await interaction.reply({ embeds: [loadingEmbed] });
	},
};
